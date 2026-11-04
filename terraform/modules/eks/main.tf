module "eks" {

  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name = var.cluster_name

  cluster_version = "1.31"

  vpc_id = var.vpc_id

  subnet_ids = var.private_subnets

  eks_managed_node_groups = {

    default = {

      desired_size = 2

      min_size = 2

      max_size = 4

      instance_types = [
        var.node_instance_type
      ]

    }

  }

}