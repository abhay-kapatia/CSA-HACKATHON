require('dotenv').config()
function pay(){

    var name = jQuery('#name').val();
    var mail = jQuery('#mail').val();
    var num = jQuery('#num').val();
    var amt = jQuery('#amt').val();
    var query = "name="+name+"&mail="+mail+"&num="+num+"&amt="+amt;
    jQuery.ajax({
        type:'post',
        url:'http://localhost:5151/donate-s',
        data: query,
        success:function(result){
            console.log(result);
                var options = {
                    "key": process.env.RAZORPAY,
                    "amount": amt*100,
                    "currency": "INR",
                    "name": "SocialEyes Donation",
                    "description": "Bring a smile",
                    "image": "https://drive.google.com/file/d/1O58xxu9V6x9FEwZUIU4JAsEIZEHJbJNy/view?usp=sharing",
                    "handler": function (response){
                        console.log(response);
                        jQuery.ajax({
                                type:'post',
                                url:'http://localhost:5151/donate-s2',
                                data:"payment_id="+response.razorpay_payment_id+"&mail="+mail,
                                success:function(result){
                                    console.log(result);
                                    alert("Thanks for donating");
                                }
                        });                            }
                };
                var rzp1 = new Razorpay(options);
                rzp1.open();
                
                }
    });
}