FROM ubuntu:latest
LABEL authors="leonardorossi"

ENTRYPOINT ["top", "-b"]