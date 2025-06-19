Function CheckGlossary(inputText As String, glossaryRange As Range) As String
    Dim lines As Variant
    Dim result As String
    Dim i As Integer
    Dim found As Boolean
    
    ' Split inputText by line breaks
    lines = Split(inputText, vbLf)
    
    ' Loop through each line
    For i = LBound(lines) To UBound(lines)
        found = Application.WorksheetFunction.CountIf(glossaryRange, LCase(lines(i))) > 0
        If found Then
            result = result & "In Glossary" & vbLf
        Else
            result = result & "NOT IN GLOSSARY" & vbLf
        End If
    Next i
    
    ' Remove the last line break
    If Len(result) > 0 Then
        result = Left(result, Len(result) - 1)
    End If
    
    CheckGlossary = result
End Function

' Example usage
' =@CheckGlossary($E9, Table1[Identified Causes/Issues/Problems])
' $E9 = value to check (Checks values one line at a time)
' Table1[Identified Causes/Issues/Problems] = the glossary you are checking
