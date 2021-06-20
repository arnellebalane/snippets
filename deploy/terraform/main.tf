locals {
  name = "snippets"
  region = "ap-southeast-1"
}

provider "aws" {
  region = local.region
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 2"

  name = local.name
  cidr = "10.99.0.0/18"

  azs              = ["${local.region}a", "${local.region}b", "${local.region}c"]
  public_subnets   = ["10.99.0.0/24", "10.99.1.0/24", "10.99.2.0/24"]
  private_subnets  = ["10.99.3.0/24", "10.99.4.0/24", "10.99.5.0/24"]
  database_subnets = ["10.99.6.0/24", "10.99.7.0/24", "10.99.8.0/24"]

  enable_dns_hostnames         = true
  create_database_subnet_group = true
}

module "security_group" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 4"

  name   = local.name
  vpc_id = module.vpc.vpc_id

  ingress_with_cidr_blocks = [
    {
      from_port = 5432
      to_port   = 5432
      protocol  = "tcp"
      cidr_blocks = module.vpc.vpc_cidr_block
    }
  ]
}

resource "random_string" "db_username" {
  length  = 16
  special = false
  number  = false
}

resource "random_password" "db_password" {
  length  = 24
  special = false
}

module "db" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 3"

  identifier     = local.name
  engine         = "postgres"
  engine_version = "11.10"
  family         = "postgres11"
  instance_class = "db.t2.micro"

  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = false

  name     = local.name
  username = random_string.db_username.result
  password = random_password.db_password.result
  port     = 5432

  multi_az               = true
  subnet_ids             = module.vpc.database_subnets
  vpc_security_group_ids = [module.security_group.security_group_id]

  publicly_accessible     = true
  backup_retention_period = 0
  skip_final_snapshot     = true
  deletion_protection     = false
}

output "db_url" {
  value     = "${module.db.db_instance_username}:${module.db.db_master_password}@${module.db.db_instance_endpoint}/${module.db.db_instance_name}"
  sensitive = true
}
