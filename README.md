
# Hospitality

Phase 1 : Git Clone

git clone : https://github.com/devopsplan2026/hospitality.git

Phase 2: Create a docker file of frontend, backend and docker-compose file.

1. cd backend && touch Dockerfile
Paste the content
---------------------------------------------------------

#### Build stage: Use Maven image with JDK 17 to compile the app
FROM maven:3.9.2-eclipse-temurin-17 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy only the pom.xml to fetch dependencies separately
COPY pom.xml .

# Download all dependencies based on pom.xml to cache them
RUN mvn dependency:go-offline

# Copy the entire project source code into the container
COPY . .

# Run Maven to clean and package the application, skipping tests for speed
RUN mvn clean package -DskipTests

# Runtime stage: Use a smaller JDK image for running the app
FROM eclipse-temurin:17-jdk-jammy

# Set working directory inside the runtime container
WORKDIR /app

# Copy the built JAR file from the build stage to the runtime image
COPY --from=builder /app/target/doctor-appointment-api-1.0.0.jar app.jar

# List the JAR file to verify it exists (optional, mainly for debugging)
RUN ls -l /app/app.jar

# Expose port 8083 for the application
EXPOSE 8083

# Set the command to run the application when the container starts
ENTRYPOINT ["java", "-jar", "/app/app.jar"]



2. cd ../frontend && touch dockerfile
Paste the content

# Use Node.js 18 Alpine image for a lightweight container
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies without audit and funding info for faster build
RUN npm install --no-audit --no-fund

# Copy the rest of the application source code
COPY . .

# Run the build script to generate the production-ready static files
RUN npm run build

# Use Node.js 18 Alpine again for the runtime environment
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Install the 'serve' package globally to serve static files
RUN npm install -g serve

# Copy the build output from the previous stage into this stage
COPY --from=0 /app/build ./build

# Expose port 3003 for the server
EXPOSE 3003

# Command to start the server and serve the static files
CMD ["serve", "-s", "build", "-l", "3003"]

3. cd .. && touch docker-compose.yaml
paste the content

---------------------------------------------------------

services:
  mysql:
    image: mysql:8.0                     # Use official MySQL 8.0 image
    container_name: doctor_db            # Assign a custom name to the container
    environment:
      MYSQL_ROOT_PASSWORD: naresh         # Root password for MySQL
      MYSQL_DATABASE: doctor_appointment # Default database to create
      MYSQL_USER: doctor_user              # Non-root user credentials
      MYSQL_PASSWORD: doctor_pass123
    ports:
      - "3306:3306"                        # Map host port 3306 to container port 3306
    volumes:
      - mysql_data:/var/lib/mysql          # Persist database data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql  # Initialize database with SQL script
    healthcheck:
      test: [ "CMD", "mysqladmin", "ping", "-h", "localhost" ]  # Check if MySQL is healthy
      timeout: 20s
      retries: 10
    networks:
      - doctor_network                     # Connect to custom network

  backend:
    build:
      context: ./backend                   # Build context is the backend folder
      dockerfile: Dockerfile               # Use Dockerfile in backend folder
    container_name: doctor_backend       # Container name
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/doctor_appointment  # Database URL
      SPRING_DATASOURCE_USERNAME: doctor_user  # DB username
      SPRING_DATASOURCE_PASSWORD: doctor_pass123  # DB password
      SPRING_JPA_HIBERNATE_DDL_AUTO: validate  # Hibernate DDL auto setting
    ports:
      - "8083:8083"                        # Map host port 8083 to container port 8083
    depends_on:
      mysql:
        condition: service_healthy       # Start backend after MySQL is healthy
    restart: on-failure                     # Restart policy
    networks:
      - doctor_network                     # Connect to custom network

  frontend:
    build:
      context: ./frontend                  # Build context is the frontend folder
      dockerfile: Dockerfile               # Use Dockerfile in frontend folder
    container_name: doctor_frontend       # Container name
    ports:
      - "3003:3003"                        # Map host port 3003 to container port 3003
    environment:
      REACT_APP_API_URL: http://localhost:8083/api  # API URL for React app
    depends_on:
      - backend                            # Start frontend after backend
    networks:
      - doctor_network                     # Connect to custom network

volumes:
  mysql_data:                               # Named volume for MySQL data

networks:
  doctor_network:
    driver: bridge                         # Use bridge network driver


----------------------------------------------------------------
=======
Run the project : 
docker-compose up --build

* Frontend: http://localhost:3003
* Backend API: http://localhost:8083/api
* Database: localhost:3306

1. How to start the application
docker-compose up --build   

2. How to stop the application
docker-compose down

3. How to go inside the mysql container
docker exec -it doctor_db mysql -u root -p[PASSWORD]

4. How to check tables in mysql container

SHOW DATABASES;

USE doctor_appointment;

SHOW TABLES;

5. How to check data in table
SELECT * FROM patient;
SELECT * FROM doctor;
SELECT * FROM appointment;

6. How to add the entry in database
INSERT INTO patient (name, email, phone, password) VALUES ('John Doe', 'john.doe@example.com', '1234567890', 'password123');

7. How to delete the entry in database
DELETE FROM patient WHERE id = 1;

8. How to update the entry in database
UPDATE patient SET name = 'John Doe' WHERE id = 1;

9. How to Add doctor in database
INSERT INTO doctor (name, email, phone, specialization, hospital, experience) VALUES ('John Doe', 'john.doe@example.com', '1234567890', 'Cardiology', 'Apollo Hospital', '10 years');

10. How to delete doctor in database
DELETE FROM doctor WHERE id = 1;

11. How to update the doctor in database
UPDATE doctor SET name = 'John Doe' WHERE id = 1;   

> docker-compose down
---------------------------------------------------------

4. Create a docker Image and push to the dockerHub

- Go to frontend folder and create a image with docker-username.

docker build -t <docker-username>/image_name:tag_name

- Go to backend folder and create a image with docker-username.

docker build -t <docker-username>/image_name:tag_name

- Go to dockerhub and create a tocken after that login.

docker push yourusername/image1:tag && docker push yourusername/image2:tag

or

docker push yourusername/image1:tag & docker push yourusername/image2:tag & wait

Now automate this with the help of jenkins.

------------------------------------------------------------------

Phase 3 : Create a jenkinsfile and automate this.

pipeline {
    agent any

    environment {
        frontend_image_name = "devoopsguru/frontend"
        backend_image_name = "devoopsguru/backend"
    }	

    stages {
        stage("git-checkout") {
            steps {
                checkout scm
            }
        }
        stage("image-build") {
            steps {
                script {
                    env.frontend_tag = new Date().format("yyyy-MM-dd-HHmmss")
                    env.backend_tag = env.frontend_tag // or different tags if needed
                    env.frontend_full_image = "${env.frontend_image_name}:${env.frontend_tag}"
                    env.backend_full_image = "${env.backend_image_name}:${env.backend_tag}"
                }
            }
        }
        stage("docker login") {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker_cred', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                    }
                }
            }
        }
        stage("build and push images") {
            steps {
                script {
                    // Build frontend image
                    sh "docker build -t ${env.frontend_full_image} ./frontend"
                    // Build backend image
                    sh "docker build -t ${env.backend_full_image} ./backend"
                    
                    // Push both images in parallel
                    sh """
                        docker push ${env.frontend_full_image} &
                        docker push ${env.backend_full_image} &
                        wait
                    """
                }
            }
        }
    }
}

Phase 4 : Now we are creating a kubernetes cluster with the Help of terraform

* First we need to configure aws credentials with terraform or terminal 

Need to download: 
- [ ] AWS Cli
- [ ] Terraform
- [ ] Kubectl
- [ ] Helm
- [ ] EKSCTL

A. Create a IAM role with the policy 

Managed Policy                           Purpose
AmazonEKSClusterPolicy                   EKS cluster operations
AmazonEKSWorkerNodePolicyNode            group permissions
AmazonEKS_CNI_Policy                     VPC CNI add-on
AmazonEC2ContainerRegistryReadOnly       Pull images from ECR 
AmazonVPCFullAccess                      VPC/subnet/NAT/IGW
IAMFullAccessRole                        creation for EKS (scope down in prod)


A. Configure aws credentials 

    > aws configure 

B. Create a terraform file for kubernetes cluster

----------------------------------------------------------------
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# VPC
resource "aws_vpc" "eks_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "eks-vpc"
  }
}

# Public Subnets
resource "aws_subnet" "public_subnet_1" {
  vpc_id                  = aws_vpc.eks_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "eks-public-subnet-1"
  }
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id                  = aws_vpc.eks_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "eks-public-subnet-2"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "eks_igw" {
  vpc_id = aws_vpc.eks_vpc.id

  tags = {
    Name = "eks-igw"
  }
}

# Route Table
resource "aws_route_table" "eks_rt" {
  vpc_id = aws_vpc.eks_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.eks_igw.id
  }

  tags = {
    Name = "eks-route-table"
  }
}

# Route Table Associations
resource "aws_route_table_association" "rta_1" {
  subnet_id      = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.eks_rt.id
}

resource "aws_route_table_association" "rta_2" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.eks_rt.id
}

# IAM Role for EKS Cluster
resource "aws_iam_role" "eks_cluster_role" {
  name = "eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

# IAM Role for Node Group
resource "aws_iam_role" "eks_node_role" {
  name = "eks-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks_worker_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_ecr_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_node_role.name
}

# EKS Cluster
resource "aws_eks_cluster" "my_cluster" {
  name     = "my-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = "1.31"

  vpc_config {
    subnet_ids = [
      aws_subnet.public_subnet_1.id,
      aws_subnet.public_subnet_2.id
    ]
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy
  ]

  tags = {
    Name = "my-cluster"
  }
}

# EKS Node Group
resource "aws_eks_node_group" "my_node_group" {
  cluster_name    = aws_eks_cluster.my_cluster.name
  node_group_name = "my-node-group"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  instance_types  = ["t3.micro"]

  subnet_ids = [
    aws_subnet.public_subnet_1.id,
    aws_subnet.public_subnet_2.id
  ]

  scaling_config {
    desired_size = 1
    min_size     = 1
    max_size     = 2
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_ecr_policy
  ]

  tags = {
    Name = "my-node-group"
  }
}

# Output
output "cluster_name" {
  value = aws_eks_cluster.my_cluster.name
}

output "cluster_endpoint" {
  value = aws_eks_cluster.my_cluster.endpoint
}

output "kubeconfig_command" {
  value = "aws eks update-kubeconfig --name ${aws_eks_cluster.my_cluster.name} --region us-east-1"
}


------------------------------------------------------------------

> terraform init
> terraform plan
> terraform apply
> rm -rf .terraform .terraform.lock.hcl     # delete the terraform lock files and then
  > terraform init
  > terraform plan

> terraform apply -auto-approve 

Once apply finishes, connect to your cluster:

> kubectl get nodes

** Note = if you create a any loadbalance please change into cluster ip and then apply the terraform destroy Why because terraform try to destroy but not successful in deleting lb because some dependecy on lb and it convert into infinite loop **

> how to create and access of the cluster with CLI command

# Create access entry
aws eks create-access-entry \
    --cluster-name my-cluster \
    --principal-arn arn:aws:iam::701201543425:user/New-eks \
    --type STANDARD \
    --username New-eks \
    --region us-east-1

# Attach admin policy
aws eks associate-access-policy \
    --cluster-name my-cluster \
    --principal-arn arn:aws:iam::701201543425:user/New-eks \
    --policy-arn arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy \
    --access-scope '{"type":"cluster"}' \
    --region us-east-1

# Connect kubectl
aws eks update-kubeconfig --name my-cluster --region us-east-1

# Verify
kubectl get nodes

Phase 5 : Now we are creating a kubernetes deployment and service yaml file.

Frontend Deployment YAML: 

apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deployment
  namespace: default  # change if using a different namespace
  labels:
    app: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend-app
        image: kristen08/frontend:2026-06-06-113823
        ports:
        - containerPort: 3003

---

apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: default  # change if using a different namespace
  labels:
    app: frontend
    release: my-release  # optional, you can customize or remove
spec:
  selector:
    app: frontend
  ports:
  - name: http
    protocol: TCP
    port: 3003
    targetPort: 3003
  type: ClusterIP  # or LoadBalancer if you want it exposed externally


  Backend Deployment YAML:

apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
  namespace: default  # change if needed
  labels:
    app: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend-app
        image: kristen08/backend:2026-06-06-113823
        ports:
        - containerPort: 8083        
        env:
        - name: SPRING_DATASOURCE_URL
          value: jdbc:mysql://mysql:3306/doctor_appointment
        - name: SPRING_DATASOURCE_USERNAME
          value: doctor_user
        - name: SPRING_DATASOURCE_PASSWORD
          value: doctor_pass123
---

apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: default  # change if needed
  labels:
    app: backend
    release: my-release  # optional
spec:
  selector:
    app: backend
  ports:
  - name: http
    protocol: TCP
    port: 8083
    targetPort: 8083
  type: ClusterIP  # or NodePort/LoadBalancer based on your need


mysql-deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
  namespace: default
  labels:
    app: mysql
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        env:
          - name: MYSQL_ROOT_PASSWORD
            value: naresh
          - name: MYSQL_DATABASE
            value: doctor_appointment
          - name: MYSQL_USER
            value: doctor_user
          - name: MYSQL_PASSWORD
            value: doctor_pass123
        ports:
          - containerPort: 3306
        volumeMounts:
          - name: mysql-data
            mountPath: /var/lib/mysql
          - name: mysql-init
            mountPath: /docker-entrypoint-initdb.d/init.sql
            subPath: init.sql
      volumes:
        - name: mysql-data
          emptyDir: {}
        - name: mysql-init
          configMap:
            name: mysql-init-sql
            items:
              - key: init.sql
                path: init.sql
---
apiVersion: v1
kind: Service
metadata:
  name: mysql
  namespace: default
spec:
  selector:
    app: mysql
  ports:
    - name: mysql
      port: 3306
      targetPort: 3306
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: mysql-init-sql
  namespace: default
data:
  init.sql: |
    -- Doctor Appointment System Database Schema

    USE doctor_appointment;

    -- Create admin table
    CREATE TABLE IF NOT EXISTS admin (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create doctor table
    CREATE TABLE IF NOT EXISTS doctor (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      specialization VARCHAR(100),
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(15),
      availability VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX(email)
    );

    -- Create patient table
    CREATE TABLE IF NOT EXISTS patient (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(15),
      age INT,
      gender VARCHAR(10),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX(email)
    );

    -- Create appointment table
    CREATE TABLE IF NOT EXISTS appointment (
      id INT PRIMARY KEY AUTO_INCREMENT,
      patient_id INT NOT NULL,
      doctor_id INT NOT NULL,
      appointment_date DATE NOT NULL,
      appointment_time TIME NOT NULL,
      reason TEXT,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE,
      FOREIGN KEY (doctor_id) REFERENCES doctor(id) ON DELETE CASCADE,
      INDEX(patient_id, doctor_id, appointment_date)
    );

    -- Create default admin account
    INSERT INTO admin (email, password) VALUES ('admin@example.com', 'admin123');

    -- Create sample doctors
    INSERT INTO doctor (name, specialization, email, password, phone, availability) VALUES
    ('Dr. John Smith', 'Cardiology', 'john@clinic.com', 'password123', '9876543210', 'Mon-Fri: 9AM-5PM'),
    ('Dr. Sarah Johnson', 'Neurology', 'sarah@clinic.com', 'password123', '9876543211', 'Mon-Sat: 10AM-6PM'),
    ('Dr. Michael Brown', 'Orthopedics', 'michael@clinic.com', 'password123', '9876543212', 'Tue-Sat: 9AM-5PM');





--------------------------------------------------------

kubectl apply -f mysql-deployment.yaml && kubectl apply -f backend-deployment.yaml && kubectl apply -f frontend-deployment.yaml

> kubectl get all -n default or kubectl get all

> # Terminal 1 - Frontend
kubectl port-forward service/frontend-service 3003:80

> kubectl port-forward service/backend-service 8083:80


Go inside the database and check the details 
> kubectl exec -it mysql-c46786c7f-lkmgw -- mysql -u root -p

SHOW DATABASES;
USE doctor_appointment;
SHOW TABLES;

--------------------------------------------------------------------------

10. Monitoring tools ( prometheus and grafana)

--------------------------------------

	we are installing the prometheus via the helm :

> helm version

# Step 1 - Install Helm
sudo snap install helm --classic

# Step 2 - Verify
helm version

# Step 3 - Add Prometheus repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

# Step 4 - Update repos
helm repo update

# Step 5 - Install kube-prometheus-stack
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

or 

helm install prometheus prometheus-community/kube-prometheus-stack \
  -n monitoring \
  --create-namespace \
  --timeout 15m

# Step 6 - Check everything in monitoring namespace
kubectl get all -n monitoring

# Step 7: Access Prometheus

kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090

queries in Prometheus:

# CPU usage
rate(container_cpu_usage_seconds_total[5m])

# Memory usage
container_memory_usage_bytes

# Node status
kube_node_status_condition


# Grafana Dashboard
----------------------------------------
 
> grafana password:

kubectl --namespace monitoring get secrets prometheus-grafana -o jsonpath="{.data.admin-password}" | base64 -d ; echo

Ui is working on 9093 now we can port mapping
> kubectl port-forward -n monitoring svc/prometheus-grafana 9093:80

Go to grafana Dashboard import 

For Kubernetes pods:
Import ID 6417
- Shows pod-level metrics

1860 
Node Exporter Full

6417 
Kubernetes pods

Kubernetes containers:
Dashboard ID: 15760 
— Kubernetes / Views / Global

14282 → 
Kubernetes cAdvisor

11. Install the ArgoCD
---------------------------------------------------------

# Step 1: Install ArgoCD

kubectl create namespace argocd

kubectl apply -n argocd --server-side --force-conflicts \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Step 2: Verify pods are running

kubectl get all -n argocd

# Step 3: Expose ArgoCD UI

kubectl patch svc argocd-server -n argocd -p '{"spec":{"type":"LoadBalancer"}}'
kubectl get svc -n argocd

Wait ~2 mins for EXTERNAL-IP to appear.

# Step 4: Get admin password

kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d ; echo

# Step 5: Login

Open the EXTERNAL-IP in browser
Username: admin
Password: from above command

# Step 6: Create Application in ArgoCD

Now access ArgoCD UI:
External IP is already assigned:

a4248a672e0c2400ea79f81198239620-1782494909.us-east-1.elb.amazonaws.com

Open in browser:
http://a4248a672e0c2400ea79f81198239620-1782494909.us-east-1.elb.amazonaws.com

or 

kubectl port-forward svc/argocd-server -n argocd 8087:443


Get admin password:
kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d ; echo



Open the ARGOCD

Click "EDIT AS YAML" button (top right) and paste this:

apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: hospitality-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/devopsplan2026/Hospitality_original.git
    targetRevision: main
    path: .
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true

Click CREATE




12. Jenkins file update:

pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "kristen08/frontend"
        BACKEND_IMAGE  = "kristen08/backend"
        REGISTRY       = "docker.io"
    }

    stages {

        stage('Check Commit') {
            steps {
                script {
                    def commitMsg = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    echo "Commit message: ${commitMsg}"
                    if (commitMsg.contains('[skip ci]')) {
                        currentBuild.result = 'SUCCESS'
                        error("Skipping CI - deployment commit")
                    }
                }
            }
        }

        stage('Git Checkout') {
            steps {
                checkout scm
                echo "Code checked out successfully"
            }
        }

        stage('Generate Image Tag') {
            steps {
                script {
                    env.IMAGE_TAG = new Date().format("yyyy-MM-dd-HHmmss")
                    echo "Image Tag: ${IMAGE_TAG}"
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker_cred',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                docker rmi ${FRONTEND_IMAGE}:latest || true
                docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ./frontend
                docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${FRONTEND_IMAGE}:latest
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                docker rmi ${BACKEND_IMAGE}:latest || true
                docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} ./backend
                docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${BACKEND_IMAGE}:latest
                '''
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh '''
                docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                docker push ${FRONTEND_IMAGE}:latest
                '''
            }
        }

        stage('Push Backend Image') {
            steps {
                sh '''
                docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                docker push ${BACKEND_IMAGE}:latest
                '''
            }
        }

        stage('Update Deployment Files') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'github_cred',
                        usernameVariable: 'GIT_USERNAME',
                        passwordVariable: 'GIT_PASSWORD'
                    )
                ]) {
                    sh """
                    sed -i 's|image: ${BACKEND_IMAGE}:.*|image: ${BACKEND_IMAGE}:${IMAGE_TAG}|' backend-deployment.yaml
                    sed -i 's|image: ${FRONTEND_IMAGE}:.*|image: ${FRONTEND_IMAGE}:${IMAGE_TAG}|' frontend-deployment.yaml

                    git config user.name "Jenkins"
                    git config user.email "jenkins@example.com"

                    git remote set-url origin https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/kristen030308/Hospitality_original.git

                    git add backend-deployment.yaml frontend-deployment.yaml
                    git commit -m "Updated images to tag ${IMAGE_TAG} [skip ci]" || echo "No changes to commit"
                    git push origin HEAD:main
                    """
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sh """
                echo "ArgoCD will auto-sync the new images to EKS"
                echo "Frontend Image: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                echo "Backend Image:  ${BACKEND_IMAGE}:${IMAGE_TAG}"
                """
            }
        }

    }

    post {
        success {
            echo "✅ Pipeline executed successfully!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
        always {
            sh '''
            docker rmi ${FRONTEND_IMAGE}:${IMAGE_TAG} || true
            docker rmi ${BACKEND_IMAGE}:${IMAGE_TAG} || true
            docker rmi ${FRONTEND_IMAGE}:latest || true
            docker rmi ${BACKEND_IMAGE}:latest || true
            '''
        }
    }
}
