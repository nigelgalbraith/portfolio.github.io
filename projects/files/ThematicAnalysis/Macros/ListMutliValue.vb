Private Sub Worksheet_Change(ByVal Target As Range)
    'Code by Sumit Bansal from https://trumpexcel.com
    ' To allow multiple selections in a Drop Down List in Excel (without repetition)
    Dim OldValue As String
    Dim NewValue As String
    Dim WhatRange As Range
    
    ' Define the range named Issues'
    Set WhatRange = Me.Range("Issues")
    
    Application.EnableEvents = True
    On Error GoTo Exitsub
    
    ' Check if the changed cell is within the Waht Input range
    If Not Intersect(Target, WhatRange) Is Nothing Then
        If Target.SpecialCells(xlCellTypeAllValidation) Is Nothing Then
            GoTo Exitsub
        Else
            If Target.Value = "" Then
                GoTo Exitsub
            Else
                Application.EnableEvents = False
                NewValue = Target.Value
                Application.Undo
                OldValue = Target.Value
                If OldValue = "" Then
                    Target.Value = NewValue
                Else
                    If InStr(1, OldValue, NewValue) = 0 Then
                        ' Use vbCrLf for a new line instead of ", "
                        Target.Value = OldValue & vbLf & NewValue
                    Else
                        Target.Value = OldValue
                    End If
                End If
            End If
        End If
    End If
    
    Application.EnableEvents = True

Exitsub:
    Application.EnableEvents = True
End Sub
