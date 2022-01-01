// docs : https://prettier.io/docs/en/options.html
module.exports = {    
    arrowParens: 'avoid',               // 화살표 함수 괄호 사용 방식    
    bracketSameLine: false,             // > 다음라인 또는 같은 라인에 표기여부    
    bracketSpacing: true,               // 객체 리터럴에서 괄호에 공백 삽입 여부 {'aa':'bb'} -> { 'aa' : 'bb' }    
    htmlWhitespaceSensitivity: 'css',   // HTML 공백 감도 설정    
    jsxSingleQuote: true,               // JSX file single Quotation(') 사용 여부    
    printWidth: 120,                    // 줄 바꿈 할 폭 길이    
    proseWrap: 'preserve',              // markdown 텍스트의 줄바꿈 방식    
    quoteProps: 'as-needed',            // 객체 속성에 quote 적용 방식    
    insertPragma: false,                // 미리 정의된 @format marker의 사용 여부    
    requirePragma: false,               // 파일 상단에 미리 정의된 주석을 작성하고 Pragma로 포맷팅 사용 여부 지정    
    semi: true,                         // 세미콜론 사용 여부    
    singleQuote: true,                  // single Quotation(') 사용여부    
    tabWidth: 4,                        // 탭 너비    
    trailingComma: 'es5',               // 여러 줄을 사용할 때, 후행 콤마 사용 방식    
    useTabs: false,                     // 탭 사용 여부    
    vueIndentScriptAndStyle: false,     // Vue 파일의 script & style 태그의 들여쓰기 여부    
    endOfLine: 'auto',                  // 줄바꿈처리 (windows, linux, osx)
};
