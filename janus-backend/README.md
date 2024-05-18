# Подключиться к контейнеру
docker exec -it -u root janus-backend bash

# Создать миграцию
php bin/console make:migration

# Выполнить миграцию
php bin/console doctrine:migrations:migrate

# Fixture
php bin/console doctrine:fixtures:load