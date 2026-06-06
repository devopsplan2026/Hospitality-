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