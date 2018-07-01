package models

import (
	"time"
)

type EntityAsset struct {
	Id     int       `xorm:"not null pk autoincr INT(11)"`
	Name   string    `xorm:"not null default '' comment('名称') VARCHAR(255)"`
	Desc   string    `xorm:"not null default '' comment('描述') VARCHAR(255)"`
	Year   int       `xorm:"not null default 0 comment('年份') INT(11)"`
	AreaId int       `xorm:"not null default 0 comment('隶属领域') INT(11)"`
	Status int       `xorm:"not null default 0 comment('状态，公共、商业、私人') INT(11)"`
	Ctime  time.Time `xorm:"not null default 'CURRENT_TIMESTAMP' comment('创建时间') TIMESTAMP"`
	Utime  time.Time `xorm:"not null default 'CURRENT_TIMESTAMP' comment('更新时间') TIMESTAMP"`
}
