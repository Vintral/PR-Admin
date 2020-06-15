import 'dart:math';

import 'package:flutter/material.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  TextEditingController _username = TextEditingController();
  TextEditingController _password = TextEditingController();
  FocusNode _usernameField = FocusNode();
  FocusNode _passwordField = FocusNode();
  BuildContext _context;

  void onLogin() {
    print( 'onLogin' );
        
    if( _username.text == 'vintral' && _password.text == 'jeff' )
      Navigator.pushReplacementNamed( _context, 'admin' );
  }
  
  Widget build(BuildContext context) {
    _context = context;

    return Scaffold(
      body: Container(
        child: Stack(
          children: [
            Container(
              height: MediaQuery.of( context ).size.height / 2,              
            ),
            Align(
              alignment: Alignment.bottomCenter,
              child: Container(
                height: MediaQuery.of( context ).size.height / 2,
                color: Colors.blue[800],              
              )
            ),
            Center(
              child: Builder(
                builder: ( context ) {
                  return Card(
                    elevation: 15,
                    child: Padding(
                      padding: EdgeInsets.symmetric( vertical: 20, horizontal: 40 ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          SizedBox(
                            width: min( 400, MediaQuery.of( context ).size.width / 3 ),
                            child: TextField(
                              controller: _username,
                              focusNode: _usernameField,
                              decoration: InputDecoration(
                                labelText: 'Username',
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular( 5 ),
                                  borderSide: BorderSide(
                                    color: Colors.blue,
                                    width: 1,
                                  )
                                )
                              ),
                              onSubmitted: (_) {
                                print( 'submitted' );
                                _usernameField.unfocus();
                                FocusScope.of( context ).requestFocus( _passwordField );
                              },
                            ),
                          ),
                          SizedBox( height: 15 ),
                          SizedBox(
                            width: min( 400, MediaQuery.of( context ).size.width / 3 ),
                            child: TextField(
                              controller: _password,
                              obscureText: true,
                              focusNode: _passwordField,
                              decoration: InputDecoration(
                                labelText: 'Password',
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular( 5 ),
                                  borderSide: BorderSide(
                                    color: Colors.blue,
                                    width: 1,
                                  )
                                )
                              ),
                              onSubmitted: (_) {
                                onLogin();
                              },
                            ),
                          ),
                          SizedBox( height: 20 ),
                          RaisedButton(
                            onPressed: onLogin,
                            child: Text( 'LOGIN' ),
                            color: Colors.blue,
                            textColor: Colors.white,
                          )
                        ],
                      )
                    )
                  );
                }
              )
            )
          ],
        )
      ),
    );
  }
}