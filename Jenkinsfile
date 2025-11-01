def app

pipeline {
    agent any
    environment {
        ENV_TYPE = "production"
        PORT = 4031
        NAMESPACE = "traineegramm-ru"
        REGISTRY_HOSTNAME = "komaroff007"
        REGISTRY = "registry.hub.docker.com"
        PROJECT = "inctagram-front"
        DEPLOYMENT_NAME = "inctagram-front-deployment"
        IMAGE_NAME = "${env.BUILD_ID}_${env.ENV_TYPE}_${env.GIT_COMMIT}"
        DOCKER_BUILD_NAME = "${env.REGISTRY_HOSTNAME}/${env.PROJECT}:${env.IMAGE_NAME}"
    }

    stages {
        stage('Clone repository') {
            steps {
                checkout scm
            }
        }

        stage('Build docker image') {
            steps {
                echo "Build image started..."
                script {
                    app = docker.build("${env.DOCKER_BUILD_NAME}")
                }
                echo "Build image finished..."
            }
        }

        stage('Push docker image') {
            steps {
                echo "Push image started..."
                script {
                    docker.withRegistry("https://${env.REGISTRY}", 'traineegramm-ru') {
                        app.push("${env.IMAGE_NAME}")
                    }
                }
                echo "Push image finished..."
            }
        }

        stage('Delete image local') {
            steps {
                script {
                    sh "docker rmi -f ${env.DOCKER_BUILD_NAME}"
                }
            }
        }

        stage('Preparing deployment') {
            steps {
                echo "Preparing started..."
                sh 'ls -ltr'
                sh 'pwd'
                sh "chmod +x preparingDeploy.sh"
                sh "./preparingDeploy.sh ${env.REGISTRY_HOSTNAME} ${env.PROJECT} ${env.IMAGE_NAME} ${env.DEPLOYMENT_NAME} ${env.PORT} ${env.NAMESPACE}"
                sh "cat deployment.yaml"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withKubeConfig([credentialsId: 'prod-kubernetes']) {
                    sh 'kubectl apply -f deployment.yaml'
                    sh "kubectl rollout status deployment/${env.DEPLOYMENT_NAME} --namespace=${env.NAMESPACE}"
                    sh "kubectl get services -o wide"
                }
            }
        }
    }

    post {
        always {
            script {
                // Безопасная отправка статуса в GitHub через Jenkins Credentials
                withCredentials([string(credentialsId: 'github-status-token', variable: 'GITHUB_TOKEN')]) {
                    def status = currentBuild.result == 'SUCCESS' ? 'success' : 'failure'
                    def description = "Build ${currentBuild.result ?: 'SUCCESS'}"

                    sh """
                        curl -s -X POST \
                        -H "Authorization: token $GITHUB_TOKEN" \
                        -H "Accept: application/vnd.github.v3+json" \
                        https://api.github.com/repos/itinternshipers-coder/inctagram-front/statuses/${env.GIT_COMMIT} \
                        -d '{
                            "state": "${status}",
                            "target_url": "${env.BUILD_URL}",
                            "description": "${description}",
                            "context": "jenkins/production-build"
                        }' || echo "GitHub status update failed but continuing"
                    """
                }
            }
        }
    }
}
