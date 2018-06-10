package models

import (
	"quant/backend/rpc/engine"
)

type Pool struct {
	GeneralWithDeleted `xorm:"extends"`
	Resource           engine.QuantType `xorm:"smallint(4) notnull comment('所属资源')" form:"Resource" json:"Resource"`
	Type               string           `xorm:"varchar(128) notnull comment('类别')" form:"Type" binding:"required" json:"Type"`
	Strategy           string           `xorm:"varchar(128) notnull comment('策略')" form:"Strategy" binding:"required" json:"Strategy"`
	Name               string           `xorm:"varchar(128) notnull comment('名称')" form:"Name" binding:"required" json:"Name"`
	Status             int              `xorm:"smallint(4) notnull comment('状态')" form:"Status" json:"Status"`
}
