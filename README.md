# Calendar-component

# 简单日历选择组件
  
## 想要实现的效果
  
  1. 点击日期选择框出现日历。
  
  2. 有个日期控制栏帮助选择日期， 包括年、月、日的选择。
  
  3. 日历table，初次点击日期选择框时显示此刻的日期，日历table的日期包括当月的所有天数，同时如果当月的1号不是周日，还应补全从周日到1号的天数。还要在这个月最后1号的后面补全到周六。
  
  4. 组件初始化时，可配置可选日期的上下限。可选日期和不可选日期有样式上的区别。
  
  5. 日历控制栏、日历table的日期和选择框的日期的变化是同步的。
 
## 实现思路
  
  为了组件的可复用性，用到面向对象的思想。
   
  每个日历组件都是一个日历对象，主要包括日历选择框，日历控制显示栏，还有日历,为了保持日期控制显示栏和日历table同步变化。实现的方法有很多，比如计算这个月天数，有闰年判断的，以及switch语句计算月份天数的方法。本组件主要依赖于Date对象实现。
   
## 绘制日历格子的思路
   
  ① 首先计算传入的日期月份的天数, getMonthLength函数。new Date(year, month, 0)会创建上月的最后一天。简单解释下，传入year, month, day来获取一个新的日期实例时，会先获取指定年、月的1号，然后再加上day参数的整数值，再减去1。如new Date(2017,2,0)先获取2017-3-1，然后加上0，再减去1，就是2017-2-28。
  
  ② 计算这个月1号是周几, getFirstDay函数。new Date(year, month - 1, 1).getDay()。
  
  ③ 计算这个月日历呈现的行数, getArrHeight函数。 Math.ceil((FirstDay + MonthLength) / 7)。
  
  ④ 如果1号不是周日，则补全周日到1号的天数，需要计算上个月的天数。new Date(year, month - 1, 0).getDate()得到上一个月的最后一天，然后通过数组循环递减输出上月最后几天，到firstDay为0。
  
  ⑤ 从1号到这个月最后一天循环。
  
  ⑥ 补全最后一天到周六的天数。从1开始累加输出，直到最后一行输出7个数。
