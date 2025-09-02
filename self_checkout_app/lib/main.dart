import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

void main() {
  runApp(const SelfCheckoutApp());
}

class Product {
  final String barcode;
  final String name;
  final double price;

  Product(this.barcode, this.name, this.price);
}

class SelfCheckoutApp extends StatelessWidget {
  const SelfCheckoutApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Self Checkout',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const CheckoutPage(),
    );
  }
}

class CheckoutPage extends StatefulWidget {
  const CheckoutPage({super.key});

  @override
  State<CheckoutPage> createState() => _CheckoutPageState();
}

class _CheckoutPageState extends State<CheckoutPage> {
  final List<Product> _products = [
    Product('123456789012', 'Apple', 0.99),
    Product('987654321098', 'Banana', 0.59),
    Product('111222333444', 'Milk', 2.49),
    Product('555666777888', 'Bread', 1.99),
  ];

  final Map<String, int> _cart = {};
  final Map<String, Product> _productMap = {};

  @override
  void initState() {
    super.initState();
    for (var p in _products) {
      _productMap[p.barcode] = p;
    }
  }

  void _onBarcodeScanned(String barcode) {
    if (_productMap.containsKey(barcode)) {
      setState(() {
        _cart.update(barcode, (value) => value + 1, ifAbsent: () => 1);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Product with barcode $barcode not found')),
      );
    }
  }

  double get _totalPrice {
    double total = 0;
    _cart.forEach((barcode, qty) {
      final product = _productMap[barcode];
      if (product != null) {
        total += product.price * qty;
      }
    });
    return total;
  }

  void _clearCart() {
    setState(() {
      _cart.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Self Checkout'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: _clearCart,
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            flex: 2,
            child: MobileScanner(
              allowDuplicates: false,
              onDetect: (barcode, args) {
                final String? code = barcode.rawValue;
                if (code != null) {
                  _onBarcodeScanned(code);
                }
              },
            ),
          ),
          Expanded(
            flex: 3,
            child: ListView.builder(
              itemCount: _cart.length,
              itemBuilder: (context, index) {
                final barcode = _cart.keys.elementAt(index);
                final qty = _cart[barcode]!;
                final product = _productMap[barcode]!;
                return ListTile(
                  title: Text(product.name),
                  subtitle: Text('Price: \$${product.price.toStringAsFixed(2)}'),
                  trailing: Text('Qty: $qty'),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
              'Total: \$${_totalPrice.toStringAsFixed(2)}',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: ElevatedButton(
              onPressed: _cart.isEmpty ? null : () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Payment'),
                    content: Text('Pay \$${_totalPrice.toStringAsFixed(2)} now?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Cancel'),
                      ),
                      TextButton(
                        onPressed: () {
                          Navigator.pop(context);
                          _clearCart();
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Payment successful')),
                          );
                        },
                        child: const Text('Pay'),
                      ),
                    ],
                  ),
                );
              },
              child: const Text('Pay'),
            ),
          ),
        ],
      ),
    );
  }
}
