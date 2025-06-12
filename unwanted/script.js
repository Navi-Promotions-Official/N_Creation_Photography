

		<script src = "https://checkout.razorpay.com/v1/checkout.js"></script>

		<script>


			async function payNow() {
				const amount = document.getElementById('amount').value;

				const response = await fetch('/create-order' , {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ amount , currency: 'INR' , receipt: 'receipt#1' , notes: {} })
				});
			

				const order = await response.json();

				const options = {
					key: '',
					amount : order.amount,
					currency: order.currency,
					name: '',
					description: ' ',
					order_id: order.id,
					callback_url: 'http://localhost:3000/payment-success',
					prefill: {
						name: 'your name',
						email: 'email@sample.com',
						contact : '1234567890'
					},
					theme: {
						color : '#3399cc'
					},
				};

				handler: function (response) {
					fetch('/verify-payment' , {
						method: 'POST',
						headers: {
							'Content-Type' : 'application/json'
						},
						body: JSON.stringify({
							razorpay_order_id: response.razorpay_order_id,
							razorpay_payment_id: response.razorpay_payment_id,
							razorpay_signature: response.razorpay_signature
						})
					}).then(res => res.json())
					   .then(data => {
							if(data.status === 'ok'){
								window.location.href = '/payment-success';
							}else {
								alert('payment verification failed');
							}
					   }).catch(error => {
							console.error('Error:' , error);
							alert('Error verifying payment');
					   });
				}

				const rzp = new Razorpay(options);
				rzp.open();

			}



		</script>