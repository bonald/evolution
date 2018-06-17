package controllers

import (
	"quant/backend/common"
	"quant/backend/rpc"

	"github.com/go-redis/redis"
	"github.com/go-xorm/xorm"
	"go.uber.org/zap"
)

type Base struct {
	Config common.Conf
	Engine *xorm.Engine
	Cache  *redis.Client
	Logger *zap.SugaredLogger
	Rpc    *rpc.Rpc
}

func (b *Base) Prepare() {
	b.Config = *common.GetConfig()
	b.Cache = common.GetRedis()
	b.Engine = common.GetEngine(b.Config.Quant.Database.Name)
	b.Rpc = rpc.NewRpc(b.Config.Quant.Rpc.Host, b.Config.Quant.Rpc.Port)
	b.Logger = common.GetLogger()
}
