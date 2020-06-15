import 'package:flutter/material.dart';
import 'package:pocket_realm_admin/screens/admin.dart';
import 'package:pocket_realm_admin/screens/login.dart';

void main() {
  runApp(App());
}

class App extends StatelessWidget {  
  Route<dynamic> onGenerateRoute( route ) {
    switch( route.name ) {      
      case 'login': return MaterialPageRoute( builder: (_) => LoginPage() );
      case 'admin': return MaterialPageRoute( builder: (_) => AdminPage() );
      default: return MaterialPageRoute( builder: (_) => Scaffold( body: Center( child: Text( 'No route defined for ${route.name}' ) ) ) );
    }    
  }


  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      initialRoute: 'admin',
      onGenerateRoute: ( route ) { return onGenerateRoute( route ); },
    );
  }
}