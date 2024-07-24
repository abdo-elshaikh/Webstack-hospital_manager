#!/bin/bash
cd frontend || exit
npm start &
cd ../backend/nodejs || exit
npm start
