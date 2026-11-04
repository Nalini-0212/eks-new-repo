module "vpc" {

  source = "./modules/vpc"

  region = var.region

  vpc_cidr = var.vpc_cidr

  environment = var.environment

}

module "ecr" {

  source = "./modules/ecr"

}

module "s3" {

  source = "./modules/s3"

  bucket_name = var.bucket_name

}

module "eks" {

  source = "./modules/eks"

  cluster_name = var.cluster_name

  vpc_id = module.vpc.vpc_id

  private_subnets = module.vpc.private_subnets

  node_instance_type = var.node_instance_type

}