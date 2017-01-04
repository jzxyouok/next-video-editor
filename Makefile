include n.Makefile

TEST_APP := "ft-next-video-editor-branch-${CIRCLE_BUILD_NUM}"

test:
#verify

run:
#nht run --https --local
	forever server/app.js

provision:
	nht provision ${TEST_APP}
	nht configure ft-next-video-editor ${TEST_APP}
#nht deploy-hashed-assets
	nht deploy ${TEST_APP}

tidy:
#nht destroy ${TEST_APP}

deploy:
	nht configure
#nht deploy-hashed-assets --monitor-assets
	nht deploy
