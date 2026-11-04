terraform {

  backend "s3" {
    bucket         = "eks-platform-tf-state-01"
    key            = "eks/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    use_lockfile = true
  }

}