Private Sub Worksheet_Change(ByVal Target As Range)
    Dim Oldvalue As String
    Dim Newvalue As String
    Dim FactorsRange As Range
    Dim entryMode As String
    
    On Error GoTo Exitsub
    Application.EnableEvents = False

    ' Get current entry mode
    entryMode = ThisWorkbook.Names("Mode").RefersToRange.Value

    ' Exit if manual mode is selected
    If LCase(entryMode) = "manual" Then GoTo Exitsub

    Set FactorsRange = Me.Range("Factors")

    If Not Intersect(Target, FactorsRange) Is Nothing Then
        If Target.SpecialCells(xlCellTypeAllValidation) Is Nothing Then GoTo Exitsub
        If Target.Value = "" Then GoTo Exitsub

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

Exitsub:
    Application.EnableEvents = True
End Sub

