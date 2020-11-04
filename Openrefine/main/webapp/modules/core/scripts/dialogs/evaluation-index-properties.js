function getEvaluationIndexProperties() {
	return {
		desc: {
			indexId: "측정하고자 하는 품질지표 입니다.",
			testIndex: "시험 항목을 선택합니다.",
			correctedIndex: "데이터 품질 보정 알고리즘을 선택합니다."
		},
		properties: [
			{
				isAvailable: true,
				id: "ACCURACY",
				text: "정확성",
				desc: "구문 데이터 정확성, 의미 데이터 정확성, 데이터 세트의 부정확성의 위험, 데이터 범위 정확성등을 측정합니다.",
				setting: {
					test_items: [
						{
							id: "SYNTAX_CORRECTNESS",
							text: "구문 데이터 정확성",
							desc : "구문데이터 정확성 설명을 여기에 적습니다. <br>구문데이터 정확성은 어쩌고 저쩌고, 선택할수 있는 보정 값은 숫자, 날짜 2가지로 제한됩니다.",
							// 시험항목 목록
							correctedOptions : [{
			                    id: "syntax_date",
			                    text: "타입 변경",
		                        property : {
		                            type : "select",
		                            text : "날짜",
		                            id : "date_format",
		                            options : [{
		                                value : 'yyyy-MM-dd',
		                                text : 'yyyy-MM-dd'
		                            }]
		                        },
		                        chartLabels : {
		                        	rText : 'DATE',
		                        	wText : 'NOT DATE',
		                        	eText : 'ERROR'
		                        }
			                }]
						},
						{
							id: "SEMEANTIC_ACCURACY",
							text: "의미 데이터 정확성"
						},
						{
							id: "DATASET_INACCURACY",
							text: "데이터 세트의 부정확성의 위험"
						},
						{
							id: "RANGE_ACCURACY",
							text: "데이터 범위 정확성"
						}
					]
				}
			},{
			    isAvailable: true,
			    id: "COMPLETENESS",
			    text: "완전성",
			    desc: "기록 완정성, 데이터 값 완정성 등을 측정합니다.",
			    setting : {
			        test_items : [
			            {
			                id: "ACCURACY_RECORD",
			                text: "기록의 완전성",
			                correctedOptions: [
			                    {
			                        id: "REMOVE_NULL",
			                        text: "NULL 데이터 삭제",
			                        chartLabels : {
			                        	rText : 'NOT NULL',
			                        	wText : 'NULL'
			                        }
			                    }
			                ]
			            }, {
			                id: "TEST",
			                text: "테스트옵션들",
			                correctedOptions : [{
			                    id: "text",
			                    text: "텍스트박스",
			                    property : {
			                        type : "text",
			                        text : "문자",
			                        id : "char_id"
			                    }
			                }, {
		                        id: "number",
		                        text: "숫자박스",
		                        property : {
		                            type : "number",
		                            text : "숫자",
		                            id : "num_id"
		                        }                        
		                    }, {
		                        id: "RADIO",
		                        text: "라디오버튼",
		                        property : {
		                            type : "radio",
		                            text : "라디오",
		                            id : "radio_id",
		                            options : [{
		                                value : 'radioId1',
		                                text : '라디오옵션1'
		                            },{
		                                value : 'radioId2',
		                                text : '라디오옵션2'
		                            },{
		                                value : 'radioId3',
		                                text : '라디오옵션3'
		                            }]
		                        }
		                    }, {
		                        id: "CHECK",
		                        text: "체크버튼",
		                        property : {
		                        	// checkbox는 값을 ',' 로 전달하도록 구현되어 있기 때문에 option value에 ','를 사용하면 안됨.
		                            type : "checkbox",
		                            text : "체크박스"
		                            	
		                            	,
		                            id : "check_id",
		                            options : [{
		                                value : 'checkId1',
		                                text : '체크박스옵션1'
		                            },{
		                                value : 'checkId2',
		                                text : '체크박스옵션2'
		                            },{
		                                value : 'checkId3',
		                                text : '체크박스옵션3'
		                            }]
		                        }
		                    }, {
		                        id: "SELECT",
		                        text: "셀렉트박스",
		                        property : {
		                            type : "select",
		                            text : "셀렉트",
		                            id : "select_id",
		                            options : [{
		                                value : 'selectId1',
		                                text : '셀렉트옵션1'
		                            },{
		                                value : 'selectId2',
		                                text : '셀렉트옵션2'
		                            },{
		                                value : 'selectId3',
		                                text : '셀렉트옵션3'
		                            }]
		                        }
		                    }]                
			            }
			        ]
			    }    
			},
			{
				isAvailable: false,
				id: "CONSISTENCY",
				text: "일관성",
				desc: "참조 무결성, 데이터 불일치의 위험, 의미론적 일관성 등을 측정합니다.",
				setting: {
					test_items: [
						{
							id: "",
							text: ""
						}
					],
					quality_correction_items: [],
					sub_correction_items : {}
				}
			},
			{
				isAvailable: false,
				id: "PRESENT",
				text: "현재성",
				desc: "업데이트 주기와 조건에 맞게 업데이트 요청이 있는 정보 아이템의 비율을 측정합니다.",
				setting: {
					test_items: [
						{
							id: "",
							text: ""
						}
					]
				}
			},
			{
				isAvailable: false,
				id: "COMPLIANCE",
				text: "준수성",
				desc: "표준, 협약 또는 규정에 부합하는 데이터 아이템의 비율을 측정합니다.",
				setting: {
					test_items: [
						{
							id: "",
							text: ""
						}
					]
				}
			},
			{
				isAvailable: false,
				id: "PRECISION",
				text: "정밀성",
				desc: "명세서의 정밀도를 만족하는 데이터 값의 비율을 측정합니다.",
				setting: {
					test_items: [
						{
							id: "",
							text: ""
						}
					]
				}
			},
			{
				isAvailable: false,
				id: "TRACEABILITY",
				text: "추적성",
				desc: "요청된 접근 추적성 값이 존재하는 데이터 값의 비율을 측정합니다.",
				setting: {
					test_items: [
						{
							id: "",
							text: ""
						}
					]
				}
			},
			{
				isAvailable: false,
				id: "UNDERSTANDING",
				text: "이해성",
				desc: "이해 가능한 기호로 표시되는데이터  값의 비율을 측정합니다.",
				setting: {
					test_items: [
						{
							id: "",
							text: ""
						}
					]
				}
			}
		]
	}
}