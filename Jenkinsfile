// Определяем переменную для Docker-образа, чтобы использовать ее в нескольких stage
def app

// Начало пайплайна Jenkins
pipeline {
    // Запускаем на любом доступном агенте (Jenkins worker)
    agent any

    // Определяем переменные окружения для всего пайплайна
    environment {
        ENV_TYPE = "production"  // Тип окружения для деплоя
        PORT = 4031              // Порт приложения
        NAMESPACE = "traineegramm-ru"  // Kubernetes namespace
        REGISTRY_HOSTNAME = "komaroff007"  // Имя пользователя в Docker Registry
        REGISTRY = "registry.hub.docker.com"  // Адрес Docker Registry
        PROJECT = "inctagram-front"  // Название проекта
        DEPLOYMENT_NAME = "inctagram-front-deployment"  // Имя deployment в Kubernetes
        // Формируем уникальное имя образа на основе ID билда, окружения и коммита
        IMAGE_NAME = "${env.BUILD_ID}_${env.ENV_TYPE}_${env.GIT_COMMIT}"
        // Полное имя для билда Docker-образа
        DOCKER_BUILD_NAME = "${env.REGISTRY_HOSTNAME}/${env.PROJECT}:${env.IMAGE_NAME}"
    }

    // Основные этапы пайплайна
    stages {
        // Этап 1: Клонирование репозитория
        stage('Clone repository') {
            steps {
                // Jenkins автоматически клонирует репозиторий based on SCM configuration
                checkout scm
            }
        }

        // Этап 2: Уведомление GitHub о начале сборки
        stage('Notify GitHub - START') {
            steps {
                // Отправляем статус 'PENDING' в GitHub - сборка началась
                // Этот статус будет отображаться в PR как "ожидание"
                githubNotify status: 'PENDING',
                            context: 'jenkins/production-build',  // Уникальный идентификатор проверки
                            description: 'Build started...'  // Описание для пользователя
            }
        }

        // Этап 3: Сборка Docker-образа
        stage('Build docker image') {
            steps {
                echo "Build image started..."
                script {
                    // Собираем Docker-образ с указанным именем
                    app = docker.build("${env.DOCKER_BUILD_NAME}")
                }
                echo "Build image finished..."
            }
        }

        // Этап 4: Пуш образа в Docker Registry
        stage('Push docker image') {
            steps {
                echo "Push image started..."
                script {
                    // Авторизуемся в Docker Registry и пушим образ
                    docker.withRegistry("https://${env.REGISTRY}", 'traineegramm-ru') {
                        app.push("${env.IMAGE_NAME}")
                    }
                }
                echo "Push image finished..."
            }
        }

        // Этап 5: Очистка - удаление образа из локального Docker
        stage('Delete image local') {
            steps {
                script {
                    // Удаляем собранный образ с локальной машины Jenkins для экономии места
                    sh "docker rmi -f ${env.DOCKER_BUILD_NAME}"
                }
            }
        }

        // Этап 6: Подготовка к деплою в Kubernetes
        stage('Preparing deployment') {
            steps {
                echo "Preparing started..."
                // Отладочная информация: список файлов и текущая директория
                sh 'ls -ltr'
                sh 'pwd'
                // Делаем скрипт исполняемым и запускаем его с параметрами
                sh "chmod +x preparingDeploy.sh"
                sh "./preparingDeploy.sh ${env.REGISTRY_HOSTNAME} ${env.PROJECT} ${env.IMAGE_NAME} ${env.DEPLOYMENT_NAME} ${env.PORT} ${env.NAMESPACE}"
                // Показываем сгенерированный deployment.yaml для отладки
                sh "cat deployment.yaml"
            }
        }

        // Этап 7: Деплой в Kubernetes
        stage('Deploy to Kubernetes') {
            steps {
                // Используем credentials для доступа к Kubernetes кластеру
                withKubeConfig([credentialsId: 'prod-kubernetes']) {
                    // Применяем конфигурацию deployment
                    sh 'kubectl apply -f deployment.yaml'
                    // Ждем пока deployment успешно завершит rollout
                    sh "kubectl rollout status deployment/${env.DEPLOYMENT_NAME} --namespace=${env.NAMESPACE}"
                    // Показываем информацию о сервисах для проверки
                    sh "kubectl get services -o wide"
                }
            }
        }
    }

    // Пост-обработка - выполняется ВСЕГДА после всех stages
    post {
        always {
            // Всегда отправляем финальный статус в GitHub независимо от результата сборки
            // currentBuild.currentResult - автоматическая переменная Jenkins (SUCCESS, FAILURE, UNSTABLE)
            githubNotify status: currentBuild.currentResult,
                         context: 'jenkins/production-build',  // Должен совпадать с начальным context!
                         description: 'Build and deployment status'  // Описание результата
        }
    }
}
