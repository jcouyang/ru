describe('defn', function () {
    describe('defn w name', function () {
        function f$911() {
            switch (arguments.length) {
            case 1:
                var arr$916 = arguments;
                var i$917 = 0;
                var a$919 = arr$916[i$917++];
                return a$919;
                break;
            }
        }
        ;
        it('', function () {
            expect(f$911(1)).toBe(1);
        });
    });
    describe('defn w/o name', function () {
        var f$922 = function () {
            switch (arguments.length) {
            case 1:
                var arr$927 = arguments;
                var i$928 = 0;
                var a$930 = arr$927[i$928++];
                return a$930;
                break;
            }
        };
        it('', function () {
            expect(f$922(1)).toBe(1);
        });
    });
});