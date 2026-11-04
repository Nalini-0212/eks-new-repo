output "cluster_name" {
  value = module.eks.cluster_name
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "frontend_ecr" {
  value = module.ecr.frontend_url
}

output "backend_ecr" {
  value = module.ecr.backend_url
}

output "worker_ecr" {
  value = module.ecr.worker_url
}