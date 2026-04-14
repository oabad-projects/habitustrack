#!/bin/sh
set -e

npx prisma generate
npx prisma db push
npm run start
