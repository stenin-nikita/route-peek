# Руководство по вкладу {#contributing-guide}

Здравствуйте! Мы рады, что вы хотите внести вклад в проект Route Peek. Участие в open source проектах может происходить разными способами, и каждый вклад важен. В этом руководстве вы найдете шаги и рекомендации, которые помогут вам подготовиться к внесению изменений.

## Начало работы{#getting-started}

Чтобы начать работу с репозиторием, выполните следующие действия:

1. **Форк репозитория**

Прежде всего, вам нужно форкнуть репозиторий. Для этого нажмите кнопку <kbd>Fork</kbd> в правом верхнем углу [страницы репозитория](https://github.com/stenin-nikita/route-peek). Это создаст копию проекта в вашем аккаунте GitHub.

2. **Клонирование форка**

Склонируйте ваш форк на локальный компьютер, чтобы начать работу с кодом:

```sh
git clone https://github.com/[ваше_имя_пользователя]/route-peek.git
cd route-peek
```

3. **Настройка upstream**

Добавьте оригинальный репозиторий в качестве удаленного репозитория под именем `upstream`, чтобы иметь возможность получать последние изменения:

```sh
git remote add upstream https://github.com/stenin-nikita/route-peek.git
```

4. **Установка зависимостей**

Убедитесь, что у вас установлены все необходимые зависимости для проекта, используя npm:

```sh
npm ci
```

## Работа с кодом {#working-with-code}

Теперь, когда вы настроили рабочую среду, следуйте шагам для внесения изменений:

1. **Создание новой ветки**

Всегда создавайте отдельную ветку для каждого отдельного изменения или фикса:

```sh
git checkout -b issue1234
```

2. **Внесение изменений**

Внесите необходимые изменения в код. После этого подготовьте их для коммита:

```sh
git add -A
git commit
```

Убедитесь, что ваше сообщение коммита соответствует спецификации [Conventional Commits](https://conventionalcommits.org):

```
tag: Краткое описание изменений

Подробное описание, если необходимо

Fixes #1234
```

Используйте один из следующих тегов:

- `fix` - исправление ошибки
- `feat` - добавление новой функциональности (совместимой)
- `fix!` - несовместимое исправление ошибки
- `feat!` - несовместимая новая функциональность
- `docs` - изменения документации
- `chore` - изменения, не влияющие на логику работы
- `build` - изменения в процессе сборки
- `refactor` - рефакторинг, не влияющий на логику работы
- `test` - изменение в тестах
- `ci` - изменения в конфигурации CI/CD
- `perf` - улучшение производительности

3. **Синхронизация с основной веткой**

Перед отправкой изменений убедитесь, что ваша информация актуальна:

```sh
git fetch upstream
git rebase upstream/main
```

4. **Запуск тестов**

Убедитесь, что ваши изменения не нарушают работоспособность проекта:

```sh
npm test
```

5. **Загрузка изменений**

Отправьте изменения в ветку вашего форка на GitHub:

```sh
git push origin issue1234
```

6. **Создание pull request**

Перейдите в ваш форк на GitHub и создайте pull request. Ознакомьтесь с [документацией GitHub по созданию pull request](https://docs.github.com/en/pull-requests) для получения подробных инструкций.

---

Надеемся, это руководство поможет вам легко и успешно внести свой вклад в развитие Route Peek. Благодарим за участие и поддержку!