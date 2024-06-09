# use the official Bun image
FROM node:21.6.1 as base
LABEL authors="Gerard Gajda"
WORKDIR /usr/src/app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json pnpm-lock.yaml /temp/dev/
COPY patches/ /temp/dev/patches/
RUN cd /temp/dev && pnpm install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json pnpm-lock.yaml /temp/prod/
COPY patches/ /temp/prod/patches/
RUN cd /temp/prod && pnpm install --prod --frozen-lockfile

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

ENV NODE_ENV=production

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/index.ts .
COPY --from=prerelease /usr/src/app/app/ app/
COPY --from=prerelease /usr/src/app/config/ config/
COPY --from=prerelease /usr/src/app/data/ data/
COPY --from=prerelease /usr/src/app/lib/ lib/
COPY --from=prerelease /usr/src/app/util/ util/
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/pnpm-lock.yaml .
COPY --from=prerelease /usr/src/app/tsconfig.json .

# run the app
USER node
EXPOSE 16320
ENTRYPOINT [ "pnpm", "run", "start" ]