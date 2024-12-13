#!/bin/bash

# 创建输出目录
mkdir -p static/proto

# 生成 JavaScript 文件
protoc -I=. \
  --js_out=import_style=commonjs:./static/proto \
  --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./static/proto \
  ./proto/auth.proto
