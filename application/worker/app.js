const {Pool}=require('pg');
const pool=new Pool({connectionString:process.env.DATABASE_URL});
const interval=Math.max(1000,Number(process.env.POLL_INTERVAL_MS)||3000);
let running=true;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function processOne(){const client=await pool.connect();try{await client.query('BEGIN');const {rows}=await client.query("SELECT id,title FROM tasks WHERE status='pending' ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 1");if(!rows.length){await client.query('COMMIT');return false;}await client.query("UPDATE tasks SET status='processing' WHERE id=$1",[rows[0].id]);await client.query('COMMIT');console.log('Processing task',rows[0].id,rows[0].title);await sleep(1000);await pool.query("UPDATE tasks SET status='completed',processed_at=NOW() WHERE id=$1",[rows[0].id]);return true;}catch(e){await client.query('ROLLBACK').catch(()=>{});throw e;}finally{client.release();}}
process.on('SIGTERM',()=>{running=false});process.on('SIGINT',()=>{running=false});
(async()=>{console.log('Worker started');while(running){try{if(!(await processOne()))await sleep(interval);}catch(e){console.error('Worker error',e);await sleep(interval);}}await pool.end();})().catch(e=>{console.error(e);process.exit(1)});
