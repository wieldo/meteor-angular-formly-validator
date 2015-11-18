describe('formlyValidator minnumber validator', () => {
    //
    // vars
    //
    let formlyTransformer;
    let $compile;
    let $rootScope;
    let $scope;
    let field;
    
    //
    // helpers
    //

    const validate = (value) => {
        return testUtils.validate(value, field, $scope);
    };

    const compile = (value) => {
        $scope = $rootScope.$new();
        const setup = testUtils.setupCompile({
            name: 'minnumber',
            value: value
        }, $scope, formlyTransformer);

        $compile(setup.element)($scope);
        field = $scope[setup.formName][setup.fieldName];
        $scope.$digest();
    };

    const failOn = (values) => {
        values.forEach((value) => {
            expect(validate(value)).toBeFalsy();
        });
    };

    const passOn = (values) => {
        values.forEach((value) => {
            expect(validate(value)).toBeTruthy();
        });
    };
    
    //
    // tests
    //

    beforeEach(() => {
        angular.module('testApp', ['angular-meteor', 'formly', 'formlyValidator', 'ngMock']);

        module('testApp');

        inject(function (_formlyTransformer_, _$compile_, _$rootScope_) {
            formlyTransformer = _formlyTransformer_;
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    it('should throw error on config value using strings with non numeric characters', () => {
        const values = ['a', '2a', 'two!', "!", "_"];

        values.forEach((value) => {
            expect(() => {
                compile(value);
            }).toThrowError();
        });
    });

    it('should throw error on empty config value', () => {
        const values = ["", null, undefined];

        values.forEach((value) => {
            expect(() => {
                compile(value);
            }).toThrowError();
        });
    });

    it('should throw error on boolean config value', () => {
        const values = [false, true];

        values.forEach((value) => {
            expect(() => {
                compile(value);
            }).toThrowError();
        });
    });

    it('should not throw error on config value using float numbers', () => {
        const values = [1.2, 2.1, "1.2", "2.1"];

        values.forEach((value) => {
            expect(() => {
                compile(value);
            }).not.toThrowError();
        });
    });

    describe('validator for integer', () => {

        beforeEach(() => {
            compile(5);
        });

        describe('pass', () => {
            it('should pass on equal values', () => {
                passOn([5, "5"]);
            });

            it('should pass on higher values', () => {
                passOn([5.1, 6, 7, "5.1", "6", "7"]);
            });

            it('should pass on empty values', () => {
                passOn([undefined, null, ""]);
            });
        });

        describe('fail', () => {
            it('should fail on lower values', () => {
                failOn([4, 4.9, 4.5, 1, 0, -1, -3, -5, -6, "4", "4.9", "4.5", "1", "0", "-1", "-3", "-5", "-6"]);
            });

            it('should fail on strings with non numeric characters', () => {
                failOn(['a', '2a', 'two!', "!", "_"]);
            });
        });
    });

    describe('validator for float', () => {

        beforeEach(() => {
            compile(5.1);
        });

        describe('pass', () => {
            it('should pass on higher values', () => {
                passOn([5.2, 6, 7, "5.2", "6", "7"]);
            });

            it('should pass on equal values', () => {
                passOn([5.1, "5.1"]);
            });

            it('should pass on empty values', () => {
                passOn([undefined, null, ""]);
            });
        });

        describe('fail', () => {

            it('should fail on lower values', () => {
                failOn([4, 4.9, 4.5, 1, 0, -1, -3, -5, -6, "4", "4.9", "4.5", "1", "0", "-1", "-3", "-5", "-6"]);
            });

            it('should fail on strings with non numeric characters', () => {
                failOn(['a', '2a', 'two!', "!", "_"]);
            });
        });
    });

});
