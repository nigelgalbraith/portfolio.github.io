Private Sub Worksheet_Change(ByVal Target As Range)
    Dim Oldvalue As String
    Dim Newvalue As String
    Dim FactorsRange As Range
    Set FactorsRange = Me.Range("Factors")
    
    'Function to allow adding Factors within the Factors table column from a list box
    Application.EnableEvents = True
    On Error GoTo Exitsub
    
    ' Check if the changed cell is within the "Factors" range
    If Not Intersect(Target, FactorsRange) Is Nothing Then
        If Target.SpecialCells(xlCellTypeAllValidation) Is Nothing Then
            GoTo Exitsub
        Else
            If Target.Value = "" Then
                GoTo Exitsub
            Else
                Application.EnableEvents = False
                Newvalue = Target.Value
                Application.Undo
                Oldvalue = Target.Value
                If Oldvalue = "" Then
                    Target.Value = Newvalue
                Else
                    If InStr(1, Oldvalue, Newvalue) = 0 Then
                        Target.Value = Oldvalue & vbCrLf & Newvalue
                    Else
                        Target.Value = Oldvalue
                    End If
                End If
            End If
        End If
    End If
    
    Application.EnableEvents = True

Exitsub:
    Application.EnableEvents = True
End Sub

