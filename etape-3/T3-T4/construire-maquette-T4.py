"""Construit page-test-T4.html à partir du gabarit et des rendus du spécimen 02.

Usage : python3 construire-maquette-T4.py DOSSIER_RENDUS
DOSSIER_RENDUS contient spec02.json, spec02.html, spec02-whatsapp.txt,
spec02-texte.txt et logo.datauri (jamais versionné). Le pivot et le texte brut
sont lus dans etape-2/specimens/.
"""
import json, pathlib, sys

ici = pathlib.Path(__file__).parent
r = pathlib.Path(sys.argv[1])
spec = ici.parent.parent / "etape-2" / "specimens"
js = lambda s: json.dumps(s, ensure_ascii=False).replace("</", "<\\/")
page = (ici / "gabarit-maquette-T4.html").read_text(encoding="utf-8")
remplacements = {
    "__DOC__": js(json.loads((r / "spec02.json").read_text(encoding="utf-8"))),
    "__BRUT__": js((spec / "02-invitation.brut.txt").read_text(encoding="utf-8")),
    "__PIVOT__": js((spec / "02-invitation.pivot-detecte.md").read_text(encoding="utf-8")),
    "__WHATSAPP__": js((r / "spec02-whatsapp.txt").read_text(encoding="utf-8")),
    "__TEXTE__": js((r / "spec02-texte.txt").read_text(encoding="utf-8")),
    "__EMAIL_HTML__": js((r / "spec02.html").read_text(encoding="utf-8")),
    "__LOGO__": (r / "logo.datauri").read_text(encoding="utf-8").strip(),
}
for k, v in remplacements.items():
    assert k in page, k
    page = page.replace(k, v)
(ici / "page-test-T4.html").write_text(page, encoding="utf-8")
print("page-test-T4.html :", len(page), "octets")
