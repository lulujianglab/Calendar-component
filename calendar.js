function Calendar(options) {
    this.options = options

    // 需要使用日历功能的文本框
    this.input = document.querySelector('[data-calendar]')

    // 当前年月日
    var date = new Date()
    this.year = date.getFullYear()
    this.month = date.getMonth() + 1
    this.day = date.getDate()
    // 星期几
    this.init()
}

Calendar.prototype = {
    init: function() {
        // 初始化日历DOM:年月日下拉框
        this.initDom()
        // 日历头部显示当前的年月日
        this.initProperty()
        // 日历表格显示
        this.paint(this.year, this.month)
        // 日历点击事件更新DOM
        this.initEvent()
    },

    // 创建日历表格，初始化日历元素年月日下拉框DOM
    initDom: function() {
        // 创建日历元素
        var calendar = document.createElement('div')
        calendar.id = 'calendar'
        calendar.className = this.options.calendarClass
        calendar.style.display = "none"
        // 创建日历下拉框元素
        var selectBox = document.createElement('div')

        // 创建年份下拉框
        var selectYear = document.createElement('select')
        selectYear.id = 'year'
        for (var i = this.year; i < 2030; i++)  {
            var option = document.createElement('option')
            option.value = i
            option.innerHTML = i
            selectYear.appendChild(option)
        }
        
        // 创建月份下拉框
        var selectMonth = document.createElement('select')
        selectMonth.id = 'month'
        for (var i = this.month; i < 13; i++) {
            var option = document.createElement('option')
            option.value = i
            option.innerHTML = i
            selectMonth.appendChild(option)
        }
        
        // 创建日下拉框
        var selectDay = document.createElement('select')
        selectDay.id = 'day'
        var monthLength = this.getMonthLength() // 判断当月天数
        for (var i = this.day; i < monthLength; i++) {
            var option = document.createElement('option')
            option.value = i
            option.innerHTML = i
            selectDay.appendChild(option)
        }

        // 创建年月日label元素
        selectBox.appendChild(selectYear)
        var yearLabel = document.createElement('label')
        yearLabel.innerHTML = '年'
        selectBox.appendChild(yearLabel)

        selectBox.appendChild(selectMonth)
        var monthLabel = document.createElement('label')
        monthLabel.innerHTML = '月'
        selectBox.appendChild(monthLabel)

        selectBox.appendChild(selectDay)
        var dayLabel = document.createElement('label')
        dayLabel.innerHTML = '日'
        selectBox.appendChild(dayLabel)

        // 将日历节点插入input节点下
        calendar.appendChild(selectBox)
        var node = this.input.nextElementSibling
        document.body.insertBefore(calendar, node)
    },

    // 在日历的头部显示当前的年月日
    initProperty: function() {
        var str = this.year + '-' + this.month + '-' + this.day
        this.input.value = str
    },

    // 显示某年某月日历表格
    paint: function(year, month) {
        var calendar = document.querySelector('#calendar')
        // 创建日历表格
        var table = document.createElement('table')
        var th = document.createElement('tr')
        th.innerHTML = '<th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th>'
        table.appendChild(th)

        // 判断行高
        var curArrHeight = this.getArrHeight(year, month)
        // 判断当月天数
        var monthLength = this.getMonthLength(year, month)
        // 判断某年某月1号是星期几
        var firstDay = this.getFirstDay(year, month)
        // 判断上一个月天数
        var preMonthLength = this.getMonthLength(year, month - 1)
        // 当月显示上一个月最后几天 
        var pre = []
        for (var i = firstDay; i > 0; i--) {
            pre.push(preMonthLength - i)
        }

        // 日历表格每行显示的天
        var cellClass = this.options.cellClass
        var usedClass = cellClass + ' ' + this.options.usedClass
        var p = 1
        var q = 1
        for (var i = 0; i < curArrHeight; i++) {
            var tr = document.createElement('tr')
            for (var j = 0; j < 7; j++) {
                var td = document.createElement('td')
                if (i == 0) {
                    // 首行
                    if (j < firstDay) {
                        td.innerHTML = pre.shift()
                        td.className = cellClass
                    } else {
                        td.innerHTML = p++
                        td.className = usedClass
                        if (td.innerHTML == this.day) {
                            td.className += 'active'
                        }
                    }
                } else if (i == curArrHeight - 1) {
                    // 末行
                    if (p <= monthLength) {
                        td.innerHTML = p++
                        td.className = usedClass
                        if (td.innerHTML == this.day) {
                            td.className += 'active'
                        }
                    } else {
                        td.innerHTML = q++
                        td.className = cellClass
                    }
                } else {
                    // 其他行
                    td.innerHTML = p++
                    td.className = usedClass
                    if (td.innerHTML == this.day) {
                        td.className += ' active'
                    }
                }
                tr.appendChild(td)
            }
            table.appendChild(tr)
        }
        calendar.appendChild(table)
    },

    // 日历点击事件:更新日历表和input输入框year、month、day
    initEvent: function() {

        var self = this

        // 输入框有焦点时弹出日历
        this.input.onfocus = function() {
            document.querySelector('#calendar').style.display = 'block'
        }

        document.querySelector('#year').addEventListener('change',function() {

            // 当前年的特殊月份与日
            if (this.selectedIndex === 0) {
                var date = new Date()
                // 当前月
                var nowmonth = date.getMonth() + 1
                // 当前日
                var nowday = date.getDate()

                // 改储存着的month、day
                self.day = nowday
                self.month = nowmonth

                // 特殊月
                document.querySelector('#month').innerHTML = ""
                for (var i = nowmonth; i < 13; i++) {
                    var option = document.createElement('option')
                    option.value = i
                    option.innerHTML = i
                    document.querySelector('#month').appendChild(option)
                }

                // 特殊日
                var dayLength = document.getElementsByClassName('used').length + 1
                document.querySelector('#day').innerHTML = ''
                for (var i = nowday; i < dayLength; i++) {
                    var option = document.createElement('option')
                    option.value = i
                    option.innerHTML = i
                    document.querySelector('#day').appendChild(option)
                }

                var calen = document.querySelector('#calendar')
                // 年份选择
                var yearBox = document.querySelector('#year')
                var yearIndex = yearBox.selectedIndex
                var yearText = yearBox[yearIndex].text
                // 月份选择
                var monthBox = document.querySelector('#month')
                var monthIndex = monthBox.selectedIndex
                var monthText = monthBox[monthIndex].text

                var index = this.selectedIndex //获取选中的年索引
                var text = this[index].text //选中的文本

                self.year = text // 把year改为选中的年份

                // 去掉之前的日历表格节点
                calen.removeChild(calen.lastChild)
                // 更新日历表格
                self.paint(yearText,monthIndex)
                // 更新input输入框
                self.input.value = self.year + '-' + self.month + '-' + self.day
            } else {
                self.updateMonth() // 默认的月份
                self.updateDay() // 默认的日
                self.day = 1 // 改储存着的day默认为1
                self.month = 1 // 改储存着的month默认为1

                var calen = document.querySelector('#calendar')

                // 年份选择
                var yearBox = document.querySelector('#year')
                var yearIndex = yearBox.selectedIndex
                var yearText = yearBox[yearIndex].text

                // 月份选择
                var monthBox = document.querySelector('#month')
                var monthIndex = monthBox.selectedIndex
                var monthText = monthBox[monthIndex].text

                var index = this.selectedIndex //获取选中的年索引
                var text = this[index].text //选中的文本

                self.year = text //把year改为选中的年份

                // 去掉之前的日历表格节点
                calen.removeChild(calen.lastChild)
                // 更新日历表格
                self.paint(yearText, monthText)
                // 更新input输入框
                self.input.value = self.year + '-' + self.month + '-' + self.day
            }
        }, false)

        document.querySelector('#month').addEventListener('change', function(){
            var date = new Date()
            var nowyear = date.getFullYear()
            var nowmonth = date.getMonth() + 1
            var nowday = date.getDate()

            // 当前年的当前月，将下拉day改成当前特殊day
            if (nowyear == self.year && this.selectedIndex === 0) {
                var dayLength = document.getElementsByClassName('used').length + 1 //特殊日
                document.querySelector('#day').innerHTML = ''
                for (var i = nowday; i < dayLength; i++) {
                    var option = document.createElement('option')
                    option.value = i
                    option.innerHTML = i
                    document.querySelector('#day').appendChild(option)
                }
                self.day = nowday // 改储存着的day
            } else {
                self.updateDay()
                self.day = 1 //改储存着的day默认为1
            }

            var calen = document.querySelector('#calendar')

            var yearBox = document.querySelector('#year')
            var yearIndex = yearBox.selectedIndex
            var yearText = yearBox[yearIndex].text

            var monthBox = document.querySelector('#month')
            var monthIndex = monthBox.selectedIndex
            var monthText = monthBox[monthIndex].text

            var index = this.selectedIndex // 获取选中的月索引
            var text = this[index].text // 选中的文本

            self.month = text // 将month改为选中的月份

            // 去掉之前的日历表格节点
            calen.removeChild(calen.lastChild)
            // 更新日历表格
            self.paint(yearText, monthText)
            // 更新input输入框
            self.input.value = self.year + '-' + self.month + '-' + self.day
        }, false)

        document.querySelector('#day').addEventListener('change', function() {
            var calen = document.querySelector('#calendar')
            
            var yearBox = document.querySelector('#year')
            var yearIndex = yearBox.selectedIndex
            var yearText = yearBox[yearIndex].text

            var monthBox = document.querySelector('#month')
            var monthIndex = monthBox.selectedIndex
            var monthText = monthBox[monthIndex].text

            var index = this.selectedIndex // 获取选中的索引
            var text = this[index].text // 选中的文本

            self.day = text //把day改为选中的日期

            // 去掉之前的日历表格节点
            calen.removeChild(calen.lastChild)
            // 更新日历表格
            self.paint(yearText, monthText)
            // 更新输入框input
            self.input.value = self.year + '-' + self.month + '-' + self.day

            calen.style.display = 'none'
        }, false)
    },

    updateMonth: function() {
        // 重新渲染下拉的month框
        document.querySelector('#month').innerHTML = ''
        for (var i = 1; i < 13; i++) {
            var option = document.createElement('option')
            option.value = i
            option.innerHTML = i
            document.querySelector('#month').appendChild(option)
        } 
    },

    updateDay: function() {
        // 重新渲染下拉的day框
        var dayLength = document.getElementsByClassName('used').length + 1
        document.querySelector('#day').innerHTML = ''
        for (var i = 1; i < dayLength; i++) {
            var option = document.createElement('option')
            option.value = i
            option.innerHTML = i
            document.querySelector('#day').appendChild(option)
        }
    },

    // 根据年月计算当月有几天
    getMonthLength: function(year, month) {
        year = year || new Date().getFullYear()
        month = month || new Date().getMonth() + 1
        // new Date(year, month, 0)会创建上月的最后一天
        return new Date(year, month, 0).getDate()
    },

    // 根据年份和月份给出当月1号是星期几
    getFirstDay: function(year, month) {
        year = year || new Date().getFullYear()
        month = month || new Date().getMonth() + 1
        return new Date(year, month - 1, 1).getDay()
    },

    // 根据年份和月份给出当月日历呈现的行数
    getArrHeight: function(year, month) {
        var monthLength = this.getMonthLength(year, month)
        var firstDay = this.getFirstDay(year, month)
        var arrHeight = Math.ceil((firstDay + monthLength) / 7)
        return arrHeight
    }
}
