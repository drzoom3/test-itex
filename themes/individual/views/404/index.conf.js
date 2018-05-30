module.exports = {
  data: {
    content: '<p>Возможно, она была удалена или никогда не существовала.'
    + '<br /> Попробуйте перейти на <a href="http://provance.hdd.test.loc/">главную страницу</a></p>',
    'this': {
      pageH1: 'Страница не найдена',
      getPageH1: function () {
        return this.pageH1;
      },
      getPageHeadTitle: function () {
        return this.pageH1;
      }
    }
  }
};
