deploy: FORCE
	git push heroku
log:
	 heroku logs --tail
up:
	heroku ps:scale web=1
FORCE: