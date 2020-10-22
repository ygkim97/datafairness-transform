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
							text: "구문 데이터 정확성"
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
					],
					quality_correction_items: [],
					sub_correction_items : {}
				}
			},
			{
				isAvailable: true,
				id: "COMPLETENESS",
				text: "완전성",
				desc: "기록 완정성, 데이터 값 완정성 등을 측정합니다.",
				setting: {
					test_items: [
						{
							id: "ACCURACY_RECORD",
							text: "기록의 완전성",
							correctedOptions : [{
								id: "REMOVE_NULL",
								text: "NULL 데이터 삭제"
							},
							{
								id: "REPLACE_NULL",
								text: "NULL 데이터 변경"
							},
							{
								id: "SELECT_TEST",
								text: "셀렉트 테스트"
							},
							{
								id: "RADIO_TEST",
								text: "라디오 테스트"
							}]
						},{
							id: "ACCURACY_RECORD2",
							text: "기록의 완전성2",
							correctedOptions : [{
								id: "REMOVE_NULL2",
								text: "NULL 데이터 삭제2"
							},
							{
								id: "REPLACE_NULL2",
								text: "NULL 데이터 변경2"
							},
							{
								id: "SELECT_TEST2",
								text: "셀렉트 테스트2"
							},
							{
								id: "RADIO_TEST2",
								text: "라디오 테스트2"
							}]
						}
					],
					sub_correction_items : {
						"REPLACE_NULL" : {
							"type" : "text",
							text : "변경 할 값",
							id : "null_replaced"
						}/*, 
						"SELECT_TEST" : {
							type : "select",
							text : "셀렉트 테스트",
							id : "select_test",
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
						},
						"RADIO_TEST" : {
							type : "radio",
							text : "라디오 테스트",
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
						}*/
					}
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
					],
					quality_correction_items: [],
					sub_correction_items : {}
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
					],
					quality_correction_items: [],
					sub_correction_items : {}
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
					],
					quality_correction_items: [],
					sub_correction_items : {}
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
					],
					quality_correction_items: [],
					sub_correction_items : {}
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
					],
					quality_correction_items: [],
					sub_correction_items : {}
				}
			}
		]
	}
}