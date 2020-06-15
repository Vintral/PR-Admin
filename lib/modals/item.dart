import 'dart:convert';
import 'dart:html';
import 'dart:math';
import 'dart:typed_data';
import 'package:http/http.dart' as http;

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:pocket_realm_admin/config.dart';
import 'package:pocket_realm_admin/styles.dart';
import 'package:pocket_realm_admin/utility.dart';

class ItemModal extends StatefulWidget {
  final dynamic data;

  ItemModal( { this.data } );
  
  @override
  State<StatefulWidget> createState() => _ItemModalState();
}

class _ItemModalState extends State<ItemModal> {
  final ImagePicker _picker = ImagePicker();
  Uint8List uploadedImage;

  BuildContext _context;

  TextEditingController _name = TextEditingController();
  TextEditingController _level = TextEditingController();
  TextEditingController _cost = TextEditingController();
  TextEditingController _description = TextEditingController();
  TextEditingController _use = TextEditingController();
  FocusNode _nameField = FocusNode();
  FocusNode _levelField = FocusNode();
  FocusNode _costField = FocusNode();
  FocusNode _descriptionField = FocusNode();
  FocusNode _useField = FocusNode();

  bool _available = false;
  
  void pickFile() async {
    InputElement uploadInput = FileUploadInputElement();
    uploadInput.click();
    uploadInput.onChange.listen((e) {
      // read file content as dataURL
      final files = uploadInput.files;
      if (files.length == 1) {
        final file = files[0];
        FileReader reader =  FileReader();

        reader.onLoadEnd.listen((e) {
          setState(() {            
            uploadedImage = reader.result;            
            setState( () {} );
          });
        });

        reader.onError.listen( ( fileEvent ) {
          print( 'ERROR' );          
        } );

        reader.readAsArrayBuffer(file);
      }
    });
  }

  Image getImage() {
    if( uploadedImage != null ) {
      return Image(
        image: MemoryImage( uploadedImage ),
      );
    }

    return Image(
      image: NetworkImage( 
        widget.data != null
          ? Config.ImageURL + 'items/' + widget.data[ 'type' ] + '.png?' + Random().nextDouble().toString() 
          : Config.ImageURL + 'items/none.png' 
      ),
    );
  }

  dynamic getPayload() {
    dynamic ret = {};

    if( widget.data != null ) ret[ 'id' ] = widget.data[ 'id' ] as int;
    if( uploadedImage != null ) ret[ 'image' ] = base64Encode( uploadedImage );
    ret[ 'name' ] = _name.text;
    ret[ 'level' ] = _level.text;
    ret[ 'cost' ] = _cost.text;
    ret[ 'available' ] = _available;
    ret[ 'description' ] = Utility.encode( _description.text );
    ret[ 'onUse' ] = Utility.encode( _use.text );
    
    return ret;
  }

  Future<http.Response> onSave() async {
    return http.post( 
      Config.URL + 'items' + ( widget.data == null ? '/add' : '' ),
      headers: <String,String> {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode( getPayload() )
    );
  }

  Future<http.Response> onDelete() async {
    return http.post( 
      Config.URL + 'items/delete',
      headers: <String,String> {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode( {
        'id': widget.data[ 'id' ] as int
      } )
    );
  }

  void onCancel() {
    print( 'onCancel' );
    closeDialog();
  }

  void onConfirm() {
    print( 'onConfirm' );
    closeDialog();
  }

  void closeDialog() {
    Navigator.of( _context ).pop();
  }  

  @override
  void initState() {    
    super.initState();

    print( widget.data );
    if( widget.data != null ) {      
      _name = TextEditingController( text: widget.data[ 'name' ] );
      _cost = TextEditingController( text: widget.data[ 'cost' ].toString() );
      _level = TextEditingController( text: widget.data[ 'level' ].toString() );
      _description = TextEditingController( text: Utility.decode( widget.data[ 'description' ].toString() ) );
      _use = TextEditingController( text: Utility.decode( widget.data[ 'onUse' ].toString() ) );
      _available = widget.data[ 'available' ] == 1;
    }
  }

  @override
  Widget build(BuildContext context) {
    print( widget.data );

    _context = context;

    return Container(
      color: Colors.blue[100],
      child: Column(
        mainAxisSize: MainAxisSize.min,        
        children: [
          Container(
            color: Colors.blue[ 400 ],
            padding: EdgeInsets.all( 20 ),
            child: Text( 
              widget.data != null ? 'Edit Item' : 'Add Item',
              style: PRStyles.ModalHeaderText
            ),
            width: 661,
          ),
          Padding(
            padding: EdgeInsets.all( 20 ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children:[
                    SizedBox(
                      width: 300,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          TextField(
                            controller: _name,
                            focusNode: _nameField,
                            decoration: InputDecoration(
                              labelText: 'Name',
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular( 5 ),
                                borderSide: BorderSide(
                                  color: Colors.blue,
                                  width: 1,
                                )
                              )
                            ),
                            onSubmitted: (_) {                        
                              _nameField.unfocus();
                              FocusScope.of( context ).requestFocus( _levelField );
                            },
                          ),
                          SizedBox( height: 10 ),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _level,
                                  focusNode: _levelField,
                                  decoration: InputDecoration(
                                    labelText: 'Level',
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular( 5 ),
                                      borderSide: BorderSide(
                                        color: Colors.blue,
                                        width: 1,
                                      )
                                    )
                                  ),
                                  onSubmitted: (_) {                        
                                    _levelField.unfocus();
                                    FocusScope.of( context ).requestFocus( _costField );
                                  },
                                ),
                              ),
                              SizedBox( width: 10 ),
                              Expanded(
                                child: TextField(
                                  controller: _cost,
                                  focusNode: _costField,
                                  decoration: InputDecoration(
                                    labelText: 'Cost',
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular( 5 ),
                                      borderSide: BorderSide(
                                        color: Colors.blue,
                                        width: 1,
                                      )
                                    )
                                  ),
                                  onSubmitted: (_) {                        
                                    _costField.unfocus();
                                    FocusScope.of( context ).requestFocus( _descriptionField );
                                  },
                                ),
                              ),
                            ],
                          ),
                          SizedBox( height: 5 ),
                          Row(
                            children:[
                              Text( 'Available: ' ),
                              Switch(
                                onChanged: (bool value) { 
                                  setState( () {
                                    _available = value;
                                  } );
                                }, 
                                value: _available,
                              )
                            ],
                          ),
                          SizedBox( height: 5 ),
                          Container(
                            height: 100,
                            child: TextField(
                              controller: _description,
                              focusNode: _descriptionField,
                              minLines: 4,
                              maxLines: 4,
                              decoration: InputDecoration(
                                labelText: 'Description',
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular( 5 ),
                                  borderSide: BorderSide(
                                    color: Colors.blue,
                                    width: 1,
                                  )
                                )
                              ),
                              onSubmitted: (_) {                        
                                _descriptionField.unfocus();
                                FocusScope.of( context ).requestFocus( _useField );
                              },
                            ),
                          ),
                        ]
                      ),
                    ),
                    SizedBox( width: 15 ),                
                    GestureDetector(
                      onTap: () async {
                        pickFile();
                      },
                      child: getImage(),
                    ),
                  ],
                ),
                SizedBox( height:10 ),
                SizedBox( 
                  width: 620,
                  child: TextField(
                    controller: _use,
                    focusNode: _useField,
                    minLines: 8,
                    maxLines: 8,
                    decoration: InputDecoration(
                      labelText: 'On Use',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular( 5 ),
                        borderSide: BorderSide(
                          color: Colors.blue,
                          width: 1,
                        )
                      )
                    ),
                    onSubmitted: (_) {                        
                      _useField.unfocus();                              
                    },
                  ),
                ),
                SizedBox( height: 10 ),
                SizedBox( 
                  width: 500,
                  child: Row(
                    mainAxisSize: MainAxisSize.max,
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children:[
                      RaisedButton(
                        color: Colors.blue,
                        onPressed: () async { 
                          await onSave();
                          Navigator.of( context ).pop( true );
                        },
                        child: Text( 'SAVE', style:PRStyles.ButtonText ),
                      ),
                      RaisedButton(
                        color: Colors.red,
                        onPressed: () async {                     
                          if( widget.data != null ) {
                            bool result = await showDialog(
                              context:context,
                              barrierDismissible:false,
                              builder: ( context ) {
                                return AlertDialog(
                                  title: Text( 'DELETE ITEM?' ),
                                  actions: [
                                    RaisedButton( 
                                      onPressed: () { 
                                        Navigator.of( context ).pop( false );
                                      },
                                      child: Text( 'CANCEL' ),
                                    ),
                                    RaisedButton(
                                      color: Colors.red,
                                      onPressed: () { 
                                        Navigator.of( context ).pop( true );
                                      },
                                      child: Text( 'DELETE' ),
                                    )
                                  ],
                                );
                              }
                            );

                            if( result ) {
                              await onDelete();
                              Navigator.of( context ).pop( true );
                            }                            
                          } else closeDialog();                          

                          return true;
                        },
                        child: Text( 
                          widget.data != null ? 'DELETE' : 'CANCEL', 
                          style:PRStyles.ButtonText 
                        ),
                      ),
                    ]
                  ),
                ),
              ]
            ),
          )
        ]
      )
    );
  }
}

