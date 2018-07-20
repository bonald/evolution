package services

import (
	"evolution/backend/common/logger"
	"evolution/backend/common/structs"
	"evolution/backend/time/models"

	"github.com/go-redis/redis"
	"github.com/go-xorm/xorm"
)

type QuestTimeTable struct {
	Pack ServicePackage
	structs.Service
}

func NewQuestTimeTable(engine *xorm.Engine, cache *redis.Client, log *logger.Logger) *QuestTimeTable {
	ret := QuestTimeTable{}
	ret.Init(engine, cache, log)
	return &ret
}

func (s *QuestTimeTable) ListWithCondition(questTimeTable *models.QuestTimeTable) (questTimeTables []models.QuestTimeTable, err error) {
	questTimeTables = make([]models.QuestTimeTable, 0)
	condition := questTimeTable.BuildCondition()
	sql := s.Engine.Where(condition)
	err = sql.Find(&questTimeTables)
	if err != nil {
		return
	}
	return
}
