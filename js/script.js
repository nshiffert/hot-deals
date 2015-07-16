var buyNow = true;


var productsUrl = 'https://api.import.io/store/data/2a4165bc-139a-46f5-b33a-b349552be856/'+
                  '_query?input/webpage/url=http%3A%2F%2Fwww.retailmenot.com%2Fideas%2Fhot-products&'+
                  '_user=2a897152-fe38-4dbc-aa69-5a3cc077abae&_apikey=2a897152fe384dbcaa695a3cc077abae8cc05af81dfa3cc72ed07e7701f27c0ef57a9428c9d3eff45f1a0020cb1090e5259d70b335da7e1966483da7631bcf0bdf82fb4ee87afe4ccf56dc0ed7e0ec4b';

var twoTapUrl = 'http://api.twotap.com/v1.0/supported_sites?country=us';

var source   = $("#entry-template").html();
var template = Handlebars.compile(source);

var resolverUrl = 'http://ra-tracker.parseapp.com/resolve?url=';

function swapLinks(){
    $(".product a").each(
        function(){
            var outUrl = $(this).attr('href');
            var outUrlEnc = encodeURI(outUrl);
            var that = this;
            $.get(resolverUrl + outUrlEnc,function(res){
                var ttTarget = extractDomain(res.Location);
                if(ttDomains[ttTarget]){
                    console.log(ttTarget);
                    var $btn = $("<button></button>");
                    $btn.addClass("btn btn-primary");
                    $btn.attr({"type":"button"});
                    $btn.text("Buy Now");
                    $btn.click(function(){
                        var t = window.screenTop - 20;
                        var l = window.screenLeft + window.outerWidth - 400;
                        console.log(t + "," + l);
                        window.open(
                            getTwoTapUrl(encodeURIComponent(res.Location)),
                            'ttbuy',
                            'width=420, height=560, menubar=no, resizable=no, titlebar=no, top='+t+', left='+l
                        )});
                    $(that).parent().append($btn);
                }
            })
        });
}
var ttDomains = [];
$(function(){

    if(buyNow){

        $.get(twoTapUrl,function(response){
            response.forEach(function(d){
                ttDomains[d.url] = true;
            });
        })
    }


    var i = 1;
    $.get(productsUrl,
        function(res){
            if(res.results.length > 0){
                res.results.forEach(function(p){
                    var ctx = {
                        imgSrc:p["idealink_image"],
                        title:p["coupontitle_link/_text"],
                        orig:p["ideacontentdel_price/_source"],
                        price:p["ideacontentins_price/_source"],
                        clickUrl:p["ideacontent_link"]
                    };
                    var html = template(ctx);
                    $(".products>.row").append(html);
                    if(i%4==0){
                        $(".products>.row").append(
                            "</div><div class=\"row\">"
                        );
                    }
                })
            }
            swapLinks();
        })
});


function extractDomain(url) {
    var domain;
    if(url){
        domain = url.replace('http://','').replace('https://','').replace('www.','').replace('www1.','').split(/[/?#]/)[0];
    }
    return domain;
}

function getTwoTapUrl(productUrl){
    var token = "abcdefg";

    return "https://checkout.twotap.com?" +
         "public_token=0a5136e12c3453da914676ef1d7baa&" +
         "unique_token=" + token + "&" +
         "confirm_url=/confirm&" +
         "products=" + productUrl + "&" +
         //"test_mode=fake_confirm&" +
         "affiliate_links=product_1_affiliate_url,product_2_affiliate_url";
}




