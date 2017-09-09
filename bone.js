Function.prototype.extends = function (fn) {

    if (fn.constructor == Function) {
        var obj
        obj = fn.prototype
    } else {
        obj = fn.n.prototype
    }
    for (var key in obj) {
        this.prototype[key] = obj[key]
    }
    return this
}

function Event() {
    var arg = arguments
    var name = arguments[0]
    this.callback = {}
}

Event.prototype.on = function (type, cb) {
    var obj
    this.callback[type] = this.callback[type] || []
    this.callback[type].push(cb)
}

Event.prototype.off = function (type) {
    delete this.callback[type]
}

Event.prototype.trigger = function (type) {
    
    Array.prototype.shift.call(arg)
    var fns = this.callback[name]
    var that = this
    fns && fns.map(function (fn) {
        fn.apply(that, arg)
    })
}

var Model = function (obj) {
    Event.call(this)
    this.obj = obj
}
Model.extends(Event)
Model.prototype.set = function (key, value) {
    var oldValue = this.obj[key]
    var newValue = value
    this.obj[key] = value
    this.trigger('change', key, oldValue, newValue)
    if (this.parent) {
        this.parent.trigger('change', key, oldValue, newValue)
    }
}
Model.prototype.get = function (key) {
    return this.obj[key]
}

var Collection = function (json) {
    Event.call(this)
    this.json = []
    this.reset(json)
    this.trigger('reset', json)
}
Collection.prototype.add = function (obj) {
    var model = new Model(obj)
    model.parent = this
    this.json.push(model)
    this.trigger('add', obj)
}

Collection.prototype.remove = function (id) {
    var arr = [],
        obj = null
    for (var i = 0; i < this.json.length; i++) {
        if (this.json[i].id != id) {

            var model = new Model(this.json[i])
            model.parent = this
            this.json.push(model)

            arr.push(model)
        } else {
            obj = this.json[i]
        }
    }
    this.json = arr

    this.trigger('remove', obj)
}

Collection.prototype.get = function (id) {
    for (var i = 0; i < this.json.length; i++) {
        var model = this.json[i]
        if (model.get('id') == id) {
            return model
        }
    }
    return null
}

Collection.prototype.reset = function (json) {
    for (var i = 0; i < json.length; i++) {
        var model = new Model(json[i])
        model.parent = this
        this.json.push(model)
    }
    this.trigger('reset', json)
}


Collection.extends(Event)