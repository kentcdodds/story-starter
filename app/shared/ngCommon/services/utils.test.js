module.exports = ngModule => {
  describe('utils', function() {
    beforeEach(window.module(ngModule.name));

    describe('#deepMerge', function() {
      var deepMerge;
      var changedObj;
      var shallowObject1;
      var shallowObject2;
      var deepObject1;
      var deepObject2;

      beforeEach(inject(function(utils) {
        deepMerge = utils.deepMerge;
        changedObj = {a: 'b', c: 'q', r: 's'};
        shallowObject1 = {a: 'b', c: 'd'};
        shallowObject2 = {a: 'z', c: 'd', e: 'f'};
        deepObject1 = {
          a: 'd',
          g: {
            deep: {
              wayDeep: [
                {
                  object: {a: 'b', c: 'd'}
                }
              ]
            }
          }
        };

        deepObject2 = {
          a: 't',
          g: {
            deep: {
              wayDeep: [
                {
                  object: {a: 'b', c: 'r'}
                },
                {
                  anotherObject: {q: 'r'}
                }
              ]
            },
            extra: {
              stuff: [1, 2, 3, 4]
            }
          }
        };
      }));

      it('should change only the first argument', inject(function(_) {
        var shallowObject1Copy = _.clone(shallowObject1);
        var shallowObject2Copy = _.clone(shallowObject2);
        var merged = deepMerge(changedObj, shallowObject1, shallowObject2);
        var expectedToBe = {a: 'z', c: 'd', e: 'f', r: 's'};
        expect(merged).to.eql(expectedToBe);
        expect(changedObj).to.eql(expectedToBe);
        expect(shallowObject1).to.eql(shallowObject1Copy);
        expect(shallowObject2).to.eql(shallowObject2Copy);
      }));

      it('should change deep objects', inject(function(_) {
        var merged = deepMerge({}, deepObject1, deepObject2);
        var result = {
          a: 't',
          g: {
            deep: {
              wayDeep: [
                {
                  object: {a: 'b', c: 'r'}
                },
                {
                  anotherObject: {q: 'r'}
                }
              ]
            },
            extra: {
              stuff: [1, 2, 3, 4]
            }
          }
        };

        expect(merged).to.eql(result);
      }));
    });


    describe('#compileUrlWithParams', function() {
      var params = {
        foo: 'fooParam',
        bar: 'barParam',
        foobar: 'foobarParam'
      };
      var compileUrlWithParams;
      beforeEach(inject(function(utils) {
        compileUrlWithParams = utils.compileUrlWithParams;
      }));

      it('should leave a url without params alone', function() {
        var templateUrl = 'plan/old/url/alone';
        var compiledUrl = compileUrlWithParams(templateUrl, params);
        expect(compiledUrl).to.equal(templateUrl);
      });

      it('should replace the params indicated in the template url', function() {
        var templateUrl = 'url/with/:foo/param/:bar';
        var compiledUrl = compileUrlWithParams(templateUrl, params);
        expect(compiledUrl).to.equal('url/with/fooParam/param/barParam');
      });

      it('should not replace params in the template that are not in the given params', function() {
        var templateUrl = 'url/with/:fake/param/:foo';
        var compiledUrl = compileUrlWithParams(templateUrl, params);
        expect(compiledUrl).to.equal('url/with/:fake/param/fooParam');
      });

      it('should ensure that a param is defined by all text until a / or the end of the url', function() {
        var templateUrl = 'url/with/:fake/param/:foobar';
        var compiledUrl = compileUrlWithParams(templateUrl, params);
        expect(compiledUrl).to.equal('url/with/:fake/param/foobarParam');
      });

      it('should behave like rest arguments', function() {
        var templateUrl = 'something/:foo/:bar/from/:other/:objects/with/:overridden';
        var compiledUrl = compileUrlWithParams(templateUrl, params, {
          other: 'otherParam',
          extra: 'extraParam',
          overridden: 'overrideMe'
        }, {
          objects: 'objectsParam',
          anotherExtra: 'anotherExtraParam',
          overridden: 'overriddenParam'
        });
        expect(compiledUrl).to.equal('something/fooParam/barParam/from/otherParam/objectsParam/with/overriddenParam');
      });
    });
  });
};
