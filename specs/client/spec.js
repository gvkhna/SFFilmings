var testdata = [ 11, "FB9A37FB-1EB8-4E66-9B8E-035A92E173BA", 11, 1397770276, "881420", 1397770276, "881420", "{\n}", "50 First Dates", "2004", "Rainforest Café (145 Jefferson Street)", null, "Columbia Pictures Corporation", "Columbia Pictures", "Peter Segal", "George Wing", "Adam Sandler", "Drew Barrymore", "Rob Schneider" ];

decribe('GET index.html', function() {
   beforeEach(function(done) {
       request('http://localhost:9000/', function(err, resp) {
            if (error) {
                return error;   
            }
           this.response = resp;
            done();
       });
   });
    
    it('is successful', function() {
        expect(this.statusCode).to.equal(200); 
    });
});