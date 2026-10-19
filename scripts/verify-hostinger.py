"""Verify the deployment ZIP against the exported public files (stdlib only)."""
from pathlib import Path
import hashlib
import json
import zipfile

archive = Path('artifacts/multipdfdoc-hostinger.zip')
with zipfile.ZipFile(archive) as bundle:
    assert bundle.testzip() is None, 'CRC mismatch'
    files = [name for name in bundle.namelist() if not name.endswith('/')]
    assert len(files) == len(set(files)), 'Duplicate archive entries'
    exported = {p.relative_to('out').as_posix(): p for p in Path('out').rglob('*') if p.is_file()}
    assert set(files) == set(exported), 'Archive/export file sets differ'
    for name in files:
        assert bundle.read(name) == exported[name].read_bytes(), f'File mismatch: {name}'
    assert '.htaccess' in files and 'index.html' in files
    assert len([name for name in files if name.startswith('samples/')]) == 3
    assert not any(name.startswith('api/') or '.env' in name or name.endswith('.tsx') for name in files)

result = {'date': '2026-10-11', 'crc': 'pass', 'allFilesMatchExport': True,
          'files': len(files), 'samples': 3, 'bytes': archive.stat().st_size,
          'sha256': hashlib.sha256(archive.read_bytes()).hexdigest(),
          'rootHtaccess': True, 'privateSourceOrEnvFiles': 0}
manifest = json.loads(Path('docs/reports/static-package.json').read_text(encoding='utf-8'))
assert result['sha256'] == manifest['sha256'] and result['bytes'] == manifest['bytes'], 'Manifest mismatch'
Path('docs/reports/static-package-verification-2026-10-11.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
print(json.dumps(result, indent=2))
