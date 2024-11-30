FROM registry.cn-hangzhou.aliyuncs.com/images-lib/image-base:node_18.20.3_alpine-1.0.0

WORKDIR /etc/infra-console

COPY . .

RUN pnpm install

RUN pnpm run build

CMD [ "pnpm","run","start:prod" ]

EXPOSE 3000
