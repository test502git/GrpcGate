# GrpcGate - 基于 gRPC-Web 的登录系统

这是一个使用 gRPC-Web、Go 和 JavaScript 实现的简单登录系统。项目展示了如何在浏览器中使用 gRPC 与后端服务进行通信，实现了一个安全、高效的身份验证门户。
演示环境：http://107.150.106.94:8080/

## 项目架构

![项目架构](https://raw.githubusercontent.com/test502git/GrpcGate/refs/heads/main/1111.png)


## 项目结构

```
.
├── proto/              # Protocol Buffer 定义文件
│   ├── auth.proto     # 服务和消息定义
│   ├── auth.pb.go     # 生成的 Go 代码
│   ├── auth_grpc.pb.go # 生成的 Go gRPC 代码
│   └── auth_pb.js     # 生成的 JavaScript 代码
├── server/            # Go 服务器实现
│   └── main.go       # 服务器入口
├── static/           # 前端文件
│   ├── client.js     # 前端 JavaScript 代码
│   ├── index.html    # HTML 模板
│   └── dist/         # 编译后的前端资源
├── go.mod            # Go 模块定义
├── package.json      # Node.js 依赖
└── webpack.config.js # Webpack 配置
```

## 环境要求

- Go 1.21 或更高版本
- Node.js 18 或更高版本
- Protocol Buffers 编译器 (protoc)
- protoc-gen-go 插件
- protoc-gen-grpc-web 插件

## 安装步骤

1. 安装 Go：
```bash
# 下载 Go 1.21.5
curl -O https://dl.google.com/go/go1.21.5.linux-amd64.tar.gz

# 解压到 /usr/local
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.21.5.linux-amd64.tar.gz

# 设置环境变量
export PATH=$PATH:/usr/local/go/bin
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```

2. 安装 Node.js：
```bash
# 下载 NodeSource 安装脚本
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -

# 安装 Node.js
sudo yum install -y nodejs
```

3. 安装 Protocol Buffers 工具：
```bash
# 安装 protoc
sudo yum install -y protobuf-compiler

# 安装 Go protobuf 插件
go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.31.0
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.3.0

# 安装 grpc-web 插件
curl -LO https://github.com/grpc/grpc-web/releases/download/1.5.0/protoc-gen-grpc-web-1.5.0-linux-x86_64
chmod +x protoc-gen-grpc-web-1.5.0-linux-x86_64
sudo mv protoc-gen-grpc-web-1.5.0-linux-x86_64 /usr/local/bin/protoc-gen-grpc-web
```

## 项目设置

1. 克隆项目后，首先安装依赖：
```bash
# 安装 Go 依赖
go mod tidy

# 安装 Node.js 依赖
npm install
```

2. 生成 Protocol Buffers 代码：
```bash
# 生成 Go 代码
protoc -I=. \
  --go_out=. --go_opt=paths=source_relative \
  --go-grpc_out=. --go-grpc_opt=paths=source_relative \
  proto/auth.proto

# 生成 JavaScript 代码
protoc -I=. \
  --js_out=import_style=commonjs,binary:. \
  --grpc-web_out=import_style=commonjs,mode=grpcwebtext:. \
  proto/auth.proto
```

3. 构建前端代码：
```bash
npm run build
```

## 运行项目

1. 启动服务器：
```bash
go run server/main.go
```

2. 访问网页：
   - 打开浏览器访问：http://localhost:8080
   - 使用以下测试账号登录：
     - 用户名：admin
     - 密码：password

## 项目原理

1. 前端（Browser）：
   - 使用 gRPC-Web 客户端库发送请求
   - 请求会被自动序列化为 Protocol Buffers 格式

2. 后端（Server）：
   - 使用 grpcweb.WrapServer 包装 gRPC 服务
   - 支持 HTTP/1.1 和跨域请求
   - 自动处理请求/响应的转换

3. 通信流程：
   - 浏览器发送 HTTP POST 请求
   - 请求被转换为 gRPC 调用
   - 服务处理请求并返回响应
   - 响应被转换回 HTTP 格式
   - 前端解析响应并更新界面

## 开发说明

1. 修改 Protocol Buffers 定义：
   - 编辑 `proto/auth.proto` 文件
   - 重新生成代码
   - 更新相关的前端和后端实现

2. 修改前端代码：
   - 编辑 `static/client.js`
   - 运行 `npm run build` 重新构建

3. 修改后端代码：
   - 编辑 `server/main.go`
   - 重启服务器

## 注意事项

1. CORS 配置：
   - 开发环境允许所有源
   - 生产环境应该限制允许的源

2. 安全性：
   - 示例使用了简单的用户名密码验证
   - 生产环境应使用更安全的认证方式

3. 错误处理：
   - 前端添加了完整的错误处理
   - 服务器端应该添加更多的错误检查

## 故障排除

1. 如果遇到 "protoc-gen-go: program not found" 错误：
   - 确认 GOPATH/bin 在 PATH 中
   - 重新安装 protoc-gen-go

2. 如果遇到跨域问题：
   - 检查服务器的 CORS 配置
   - 确认客户端请求的地址正确

3. 如果前端构建失败：
   - 检查 Node.js 版本
   - 清理并重新安装依赖
