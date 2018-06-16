package controllers

import (
	"quant/backend/common"
	"quant/backend/models"
	"quant/backend/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Item struct {
	Base
	ItemSvc     *services.Item
	ClassifySvc *services.Classify
}

func NewItem() *Item {
	Item := &Item{}
	Item.Prepare()
	Item.ItemSvc = services.NewItem(Item.Engine, Item.Cache)
	Item.ClassifySvc = services.NewClassify(Item.Engine, Item.Cache)
	return Item
}

func (c *Item) Router(router *gin.RouterGroup) {
	item := router.Group("item")
	item.POST("/sync/source", c.SyncSource)
	item.POST("/sync/classify", c.SyncClassify)
	item.GET("/:id", initItem(c.ItemSvc), c.One)
	item.GET("", c.List)
}

func initItem(svc *services.Item) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		idStr := ctx.Param("id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			common.ResponseErrorBusiness(ctx, common.ErrorParams, "id params error", err)
		}

		item, err := svc.One(id)
		if err != nil {
			common.ResponseErrorBusiness(ctx, common.ErrorMysql, "get item error", err)
		}

		ctx.Set("item", item)
		return
	}
}

func (c *Item) One(ctx *gin.Context) {
	item := ctx.MustGet("item").(models.Item)
	common.ResponseSuccess(ctx, item)
}

func (c *Item) List(ctx *gin.Context) {
	items, err := c.ItemSvc.List()
	if err != nil {
		common.ResponseErrorBusiness(ctx, common.ErrorMysql, "item get error", err)
		return
	}
	common.ResponseSuccess(ctx, items)
}

func (c *Item) SyncClassify(ctx *gin.Context) {
	var classify models.Classify
	if err := ctx.ShouldBindJSON(&classify); err != nil {
		common.ResponseErrorBusiness(ctx, common.ErrorParams, "params error: ", err)
		return
	}
	items, err := c.Rpc.GetItem(classify)
	if err != nil {
		common.ResponseErrorBusiness(ctx, common.ErrorEngine, "get item error", err)
		return
	}

	itemBatch := []models.Item{}
	for _, i := range items {
		one := models.Item{}
		one.Name = i.Name
		one.Code = i.Code
		itemBatch = append(itemBatch, one)
	}

	err = c.ItemSvc.BatchSave(classify, itemBatch)
	if err != nil {
		common.ResponseErrorBusiness(ctx, common.ErrorEngine, "classify save error", err)
		return
	}
	common.ResponseSuccess(ctx, struct{}{})
}

func (c *Item) SyncSource(ctx *gin.Context) {
	common.ResponseSuccess(ctx, struct{}{})
}
