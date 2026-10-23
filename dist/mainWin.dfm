object mainWin: TmainWin
  Left = 109
  Top = 6
  Cursor = crArrow
  Caption = 'Interactive BOM v2.12.0'
  ClientHeight = 528
  ClientWidth = 452
  Color = clWhite
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -12
  Font.Name = 'Microsoft YaHei UI'
  Font.Style = []
  OldCreateOrder = False
  Position = poScreenCenter
  Scaled = False
  BorderStyle = bsDialog
  OnShow = mainWinShow
  FormKind = fkNormal
  PixelsPerInch = 96
  TextHeight = 14
  object PageControl1: TPageControl
    Left = 8
    Top = 8
    Width = 440
    Height = 516
    ActivePage = TabSheet1
    Anchors = [akLeft, akTop, akRight, akBottom]
    TabOrder = 0
    object TabSheet1: TTabSheet
      Caption = 'General'
      object GroupBox1: TGroupBox
        Left = 7
        Top = 9
        Width = 413
        Height = 63
        Caption = 'BOM Output Path'
        Anchors = [akLeft, akTop, akRight]
        TabOrder = 0
        object BtnSave: TButton
          Left = 373
          Top = 22
          Width = 32
          Height = 26
          Caption = '...'
          Anchors = [akTop, akRight]
          TabOrder = 0
          OnClick = BtnSaveClick
        end
        object TEditCurrentPcbPath: TEdit
          Left = 61
          Top = 24
          Width = 304
          Height = 21
          ReadOnly = True
          Anchors = [akLeft, akTop, akRight]
          TabOrder = 1
        end
      end
      object StaticText1: TStaticText
        Left = 18
        Top = 37
        Width = 48
        Height = 17
        Caption = 'Directory'
        TabOrder = 1
      end
      object GroupBox3: TGroupBox
        Left = 7
        Top = 81
        Width = 413
        Height = 120
        Caption = 'Extra PCB Data'
        Anchors = [akLeft, akTop, akRight]
        TabOrder = 2
        object RBtnGenerateAll: TRadioButton
          Left = 14
          Top = 18
          Width = 150
          Height = 17
          Caption = 'Generate Full'
          Checked = True
          TabOrder = 4
        end
        object RBtnGenerateCompact: TRadioButton
          Left = 180
          Top = 18
          Width = 150
          Height = 17
          Caption = 'Compact'
          TabOrder = 5
        end
        object CbIncludeTracksAndSolidPolygons: TCheckBox
          Left = 14
          Top = 46
          Width = 167
          Height = 17
          Caption = 'Include Tracks/Polygons'
          TabOrder = 0
        end
        object CbIncludeVias: TCheckBox
          Left = 14
          Top = 75
          Width = 87
          Height = 17
          Caption = 'Include Vias'
          TabOrder = 1
        end
        object CbIncludeHatched: TCheckBox
          Left = 206
          Top = 46
          Width = 167
          Height = 17
          Caption = 'Include Hatched'
          TabOrder = 2
        end
        object CbIncludeNets: TCheckBox
          Left = 206
          Top = 75
          Width = 87
          Height = 17
          Caption = 'Include Nets'
          TabOrder = 3
        end
      end
      object GroupBox4: TGroupBox
        Left = 7
        Top = 209
        Width = 413
        Height = 103
        Caption = 'Component Blacklist'
        Anchors = [akLeft, akTop, akRight]
        TabOrder = 3
        object CbBlacklistEmpty: TCheckBox
          Left = 14
          Top = 35
          Width = 207
          Height = 17
          Caption = 'DNP/Empty/~ Value'
          Checked = True
          State = cbChecked
          TabOrder = 0
        end
        object CbBlacklist1Pad: TCheckBox
          Left = 238
          Top = 35
          Width = 135
          Height = 17
          Caption = '1 Pad Component'
          Checked = True
          State = cbChecked
          TabOrder = 1
        end
        object CbBlacklistTh: TCheckBox
          Left = 14
          Top = 67
          Width = 135
          Height = 17
          Caption = 'TH Component'
          Checked = True
          State = cbChecked
          TabOrder = 2
        end
      end
      object GenerateBom: TButton
        Left = 336
        Top = 442
        Width = 80
        Height = 25
        Caption = 'Generate BOM'
        Anchors = [akRight, akBottom]
        TabOrder = 4
        OnClick = GenerateBomClick
      end
      object GroupBox10: TGroupBox
        Left = 7
        Top = 321
        Width = 413
        Height = 58
        Caption = 'PCB Outline Layer'
        Anchors = [akLeft, akTop, akRight]
        TabOrder = 5
        object RBtnKeepOutLayer: TRadioButton
          Left = 206
          Top = 28
          Width = 200
          Height = 17
          Caption = 'Keep Out Layer'
          TabOrder = 0
        end
        object RBtnMech1: TRadioButton
          Left = 14
          Top = 28
          Width = 130
          Height = 17
          Caption = 'Mechanical Layer 1'
          Checked = True
          TabOrder = 1
        end
      end
      object GroupBox8: TGroupBox
        Left = 7
        Top = 386
        Width = 413
        Height = 50
        Caption = 'Other'
        Anchors = [akLeft, akTop, akRight]
        TabOrder = 6
        object CbOpenBrowser: TCheckBox
          Left = 14
          Top = 22
          Width = 94
          Height = 17
          Caption = 'Open Browser'
          TabOrder = 0
        end
        object CbOpenExplorer: TCheckBox
          Left = 118
          Top = 22
          Width = 94
          Height = 17
          Caption = 'Open Explorer'
          Checked = True
          State = cbChecked
          TabOrder = 1
        end
      end
    end
    object TabSheet2: TTabSheet
      Caption = 'Settings'
      ExplicitLeft = 0
      ExplicitTop = 0
      ExplicitWidth = 0
      ExplicitHeight = 0
      object CbDarkMode: TCheckBox
        Left = 14
        Top = 15
        Width = 87
        Height = 17
        Caption = 'Dark Mode'
        TabOrder = 0
      end
      object CbShowFootprintPads: TCheckBox
        Left = 126
        Top = 15
        Width = 118
        Height = 17
        Caption = 'Show Footprint Pads'
        Checked = True
        State = cbChecked
        TabOrder = 1
      end
      object CbShowFabricationLayer: TCheckBox
        Left = 262
        Top = 15
        Width = 134
        Height = 17
        Caption = 'Show Fab Layer'
        TabOrder = 2
      end
      object CbShowSilkscreen: TCheckBox
        Left = 14
        Top = 47
        Width = 94
        Height = 17
        Caption = 'Show Silkscreen'
        Checked = True
        State = cbChecked
        TabOrder = 3
      end
      object StaticText3: TStaticText
        Left = 126
        Top = 49
        Width = 60
        Height = 17
        Caption = 'Highlight Pin 1'
        TabOrder = 4
      end
      object RBtnHighlightPin1None: TRadioButton
        Left = 190
        Top = 47
        Width = 40
        Height = 17
        Caption = 'None'
        TabOrder = 5
      end
      object RBtnHighlightPin1All: TRadioButton
        Left = 232
        Top = 47
        Width = 44
        Height = 17
        Caption = 'All'
        TabOrder = 6
      end
      object RBtnHighlightPin1Selected: TRadioButton
        Left = 278
        Top = 47
        Width = 56
        Height = 17
        Caption = 'Selected'
        TabOrder = 7
      end
      object StaticText2: TStaticText
        Left = 16
        Top = 79
        Width = 73
        Height = 17
        Caption = 'Board Rotation'
        TabOrder = 8
      end
      object TTextRotation: TStaticText
        Left = 100
        Top = 79
        Width = 30
        Height = 17
        Caption = '0'#176
        TabOrder = 9
      end
      object CbOffsetBackRotation: TCheckBox
        Left = 140
        Top = 77
        Width = 130
        Height = 17
        Caption = 'Offset Back Rotation'
        TabOrder = 10
      end
      object CbContinuousRedrawOnDrag: TCheckBox
        Left = 280
        Top = 77
        Width = 130
        Height = 17
        Caption = 'Redraw on Drag'
        Checked = True
        State = cbChecked
        TabOrder = 11
      end
      object TTrackBarRotation: TXPTrackBar
        Left = 8
        Top = 102
        Width = 415
        Height = 20
        Max = 72
        Position = 36
        SelEnd = 0
        SelStart = 0
        Anchors = [akLeft, akTop, akRight]
        TabOrder = 12
        OnChange = TTrackBarRotationChange
      end
      object GroupBox5: TGroupBox
        Left = 7
        Top = 128
        Width = 413
        Height = 58
        Caption = 'Checkboxes'
        Anchors = [akLeft, akTop, akRight]
        TabOrder = 13
        object TEditHtmlCheckboxes: TEdit
          Left = 13
          Top = 24
          Width = 304
          Height = 21
          Anchors = [akLeft, akTop, akRight]
          TabOrder = 0
          Text = 'Sourced,Placed'
        end
      end
      object GroupBox6: TGroupBox
        Left = 7
        Top = 200
        Width = 413
        Height = 58
        Caption = 'BOM View'
        Anchors = [akLeft, akTop, akRight]
        TabOrder = 14
        object RBtnBomOnly: TRadioButton
          Left = 14
          Top = 28
          Width = 113
          Height = 17
          Caption = 'BOM Only'
          TabOrder = 0
        end
        object RBtnBomLeftDrawingRight: TRadioButton
          Left = 110
          Top = 28
          Width = 135
          Height = 17
          Caption = 'BOM Left, Drawings Right'
          Checked = True
          TabOrder = 1
          TabStop = True
        end
        object RBtnBomTopDrawingBottom: TRadioButton
          Left = 254
          Top = 28
          Width = 151
          Height = 17
          Caption = 'BOM Top, Drawings Bottom'
          TabOrder = 2
        end
      end
      object GroupBox7: TGroupBox
        Left = 7
        Top = 272
        Width = 413
        Height = 58
        Caption = 'Layer View'
        Anchors = [akLeft, akTop, akRight]
        TabOrder = 15
        object RBtnFrontAndBack: TRadioButton
          Left = 110
          Top = 28
          Width = 113
          Height = 17
          Caption = 'Front and Back'
          Checked = True
          TabOrder = 0
          TabStop = True
        end
        object RBtnFrontOnly: TRadioButton
          Left = 14
          Top = 28
          Width = 79
          Height = 17
          Caption = 'Front Only'
          TabOrder = 1
        end
        object RBtnBackOnly: TRadioButton
          Left = 254
          Top = 28
          Width = 113
          Height = 17
          Caption = 'Back Only'
          TabOrder = 2
        end
      end
    end
  end
  object SaveDialog1: TSaveDialog
    DefaultExt = '.html'
    Filter = 
      'HTML files (*.html)|*.HTML|Text files (*.txt)|*.TXT|All files (*' +
      '.*)|*.*'
    Left = 392
    Top = 96
  end
  object OpenDialog1: TOpenDialog
    Filter = 
      'Field values (JSON) (*.json)|*.JSON|Text files (*.txt)|*' +
      '.TXT|All files (*.*)|*.*'
    Left = 352
    Top = 96
  end
end
