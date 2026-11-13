# NestJS 架构规范

## 推荐目录
```text
src/
├── main.ts
├── app.module.ts
├── config/
├── database/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   ├── exceptions/
│   └── types/
└── modules/
    ├── auth/
    ├── users/
    │   ├── dto/
    │   ├── users.controller.ts
    │   ├── users.service.ts
    │   └── users.module.ts
    └── ...
prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

## 目录职责
- `database/`：Prisma Client 生命周期和数据库基础设施。
- `common/`：跨业务通用 Guard、Pipe、Filter、Decorator、Interceptor、类型。
- `modules/`：按业务域组织 Controller、Service、DTO 和业务逻辑。
- `config/`：环境变量读取和校验。
- `prisma/`：Schema、Migration、Seed。

## 分层
`HTTP -> Middleware -> Guard -> Interceptor/Pipe -> Controller -> Service -> PrismaService/Repository -> Database`

依赖方向：
- Controller -> Service
- Service -> PrismaService 或 Repository
- Repository -> PrismaService
- 业务模块依赖公共基础设施
- common/database 不得反向依赖具体业务模块

Repository 不是强制层。简单 CRUD 可以由 Service 直接使用 PrismaService；复杂、重复或需要隔离的数据访问才抽 Repository。避免无价值抽象和循环依赖。
