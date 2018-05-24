src/style/interp.scss: \
	src/script/lib/codemirror/lib/_codemirror.scss \
	src/script/lib/codemirror/addon/dialog/_dialog.scss \
	src/script/lib/codemirror/theme/_blackboard.scss \
	src/style/snippets/_colors.scss \
	src/style/snippets/_interpreter.scss \
	src/style/snippets/_anim.scss \
	src/style/snippets/_header.scss \
	src/style/snippets/_fonts.scss \
	src/style/snippets/_generics.scss \
	src/style/snippets/_slidingpanel.scss \
	src/style/snippets/_mediagenerics.scss \
	src/style/snippets/_toast.scss

src/index.html: \
	src/style/interp.css \
	src/script/lib/require.js \
	src/script/mscgen-interpreter.js \
	src/images/mugshot.jpg \
	src/images/test14_cheat_sheet.svg \
	$(SAMPLES)

# documentation
src/style/doc.scss: \
	src/style/snippets/_colors.scss \
	src/style/snippets/_fonts.scss \
	src/style/snippets/_generics.scss \
	src/style/snippets/_documentation.scss \
	src/style/snippets/_header.scss \
	src/style/snippets/_mediagenerics.scss \
	src/style/snippets/_toast.scss

src/embed.html: \
	src/style/doc.css \
	src/mscgen-inpage.js \
	src/images/mugshot.jpg

src/tutorial.html: \
	src/style/doc.css \
	src/mscgen-inpage.js \
	src/images/mugshot.jpg \
	src/images/demo\ -\ screenshot\ -\ autofaded.png

# generic style stuff
src/style/_fonts.scss: $(FONT_SOURCES)

src/style/_header.scss: \
	src/images/bg.png

SAMPLES= \
	src/samples/3rdparty/acme-processing-01-challenge.msgenny \
	src/samples/3rdparty/acme-processing-02-authorization.msgenny \
	src/samples/3rdparty/acme-processing-03-certificate.msgenny \
	src/samples/3rdparty/acme-processing-04-revocation.msgenny \
	src/samples/3rdparty/criticalregion.xu \
	src/samples/3rdparty/fbauth.xu \
	src/samples/3rdparty/springhibernate.xu \
	src/samples/3rdparty/test20_quoteless_attributes.mscin \
	src/samples/chaos.mscin \
	src/samples/intro01_simple_starter.msgenny \
	src/samples/intro02_starter.mscgen \
	src/samples/intro03_cheat_sheet.mscin \
	src/samples/intro03_cheat_sheet.msgenny \
	src/samples/msgennysample.msgenny \
	src/samples/rainbow.mscin \
	src/samples/readme.mscin \
	src/samples/readme.msgenny \
	src/samples/sample01_bob_alice.mscin \
	src/samples/sample01_bob_alice.msgenny \
	src/samples/sample03_sip_(from_wikipedia).mscin \
	src/samples/sample04_intermediate_proxy_(from_wikipedia).mscin \
	src/samples/sample04_intermediate_proxy_(from_wikipedia).msgenny \
	src/samples/sample05_smtp.mscin \
	src/samples/sample10_how_mscgen_js_works.mscin \
	src/samples/sample10_how_mscgen_works.msgenny \
	src/samples/simple03_sip_(from_wikipedia).msgenny \
	src/samples/smoketest.mscin \
	src/samples/smoketest.msgenny \
	src/samples/test01_all_possible_arcs.json \
	src/samples/test01_all_possible_arcs.mscin \
	src/samples/test01_all_possible_arcs.msgenny \
	src/samples/test01_all_possible_arcs.xu \
	src/samples/test02_some_coloring.mscin \
	src/samples/test03_fsm.mscin \
	src/samples/test03_fsm.msgenny \
	src/samples/test05_smtp.msgenny \
	src/samples/test09_arcskip_over_there.mscin \
	src/samples/test10_stringsandurls.json \
	src/samples/test10_stringsandurls.mscin \
	src/samples/test10_stringsandurls.msgenny \
	src/samples/test11_autodeclaration.msgenny \
	src/samples/test12_entity_named_with_non_alphanums.mscin \
	src/samples/test16_multiline_in_detail.mscin \
	src/samples/test17_multiline_in_boxes.msgenny \
	src/samples/test18_multiline_broadcasts.msgenny \
	src/samples/test19_multiline_lipsum.mscin \
	src/samples/test20_multiline_entities.mscin \
	src/samples/test21_unicode.mscin \
	src/samples/test21_unicode.msgenny \
	src/samples/test21_unicode_colored.mscin \
	src/samples/test22_openid.mscin \
	src/samples/test23_all_signal_variants.mscin \
	src/samples/test23_all_signal_variants.msgenny \
	src/samples/test24_pile_of_poo_test.mscin \
	src/samples/test24_pile_of_poo_test.msgenny \
	src/samples/test24_pile_of_poo_test_mscgen.json \
	src/samples/test25_all_self_messages.msgenny \
	src/samples/test26_text_spacing.mscgen \
	src/samples/test27_text_spacing_whities.mscgen \
	src/samples/test42_strangeuse.mscin \
	src/samples/test43_flag.mscin \
	src/samples/test44_anotherabuse.mscgen \
	src/samples/test50_expansions.xu \
	src/samples/test51_with_alt.xu \
	src/samples/test52_alt_within_loop.xu \
	src/samples/test53_all_expansions.xu \
	src/samples/test54_nesting.xu \
	src/samples/testxx_humongous01.mscin \
	src/samples/testxx_humongous02.mscin \
	src/samples/wordfeud.mscgen \
	src/samples/zigzag.mscin \

FONT_SOURCES=src/fonts/controls.eot \
	src/fonts/controls.svg \
	src/fonts/controls.ttf \
	src/fonts/controls.woff
