# Product focus — Create first

## Concept
1. **Подписка / мультиагентная система** — пользователь делает сам.
2. **Человек** — можно обратиться, чтобы всё сделали за него.
3. **AE Create** — калькулятор, анкета, заявки, кабинет (приоритет сейчас).
4. **AE Studio** — в разработке, в UI «скоро», без рабочего потока.
5. **AE Lab / AE Games** — убрать с витрины и из owner-панели.

## Scope now
- Auth (вход / регистрация / сессия SSO)
- Личный кабинет
- Create: calculator → lead → questionnaire / cabinet

## Out of scope for now
- Lab orders / mock lab in owner requests
- Games subscriptions
- Full Studio PM product

## Apply on Mac
```bash
cd ~/Projects/webcalc-pro
git pull origin cursor/owner-create-users-859c
bash scripts/focus-create-hide-lab-games-studio.sh
```

Then open `~/Desktop/ae-it-platform` in Cursor so remaining copy/home tiles can be tuned by hand.
