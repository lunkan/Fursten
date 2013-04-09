# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: node.proto

from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import descriptor_pb2
# @@protoc_insertion_point(imports)




DESCRIPTOR = _descriptor.FileDescriptor(
  name='node.proto',
  package='messages',
  serialized_pb='\n\nnode.proto\x12\x08messages\"\'\n\x04Node\x12\t\n\x01x\x18\x01 \x02(\x11\x12\t\n\x01y\x18\x02 \x02(\x11\x12\t\n\x01r\x18\x03 \x02(\x11\"/\n\x0eNodeCollection\x12\x1d\n\x05nodes\x18\x01 \x03(\x0b\x32\x0e.messages.NodeB&\n\x19org.fursten.message.protoB\tNodeProto')




_NODE = _descriptor.Descriptor(
  name='Node',
  full_name='messages.Node',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='x', full_name='messages.Node.x', index=0,
      number=1, type=17, cpp_type=1, label=2,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='y', full_name='messages.Node.y', index=1,
      number=2, type=17, cpp_type=1, label=2,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='r', full_name='messages.Node.r', index=2,
      number=3, type=17, cpp_type=1, label=2,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  extension_ranges=[],
  serialized_start=24,
  serialized_end=63,
)


_NODECOLLECTION = _descriptor.Descriptor(
  name='NodeCollection',
  full_name='messages.NodeCollection',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='nodes', full_name='messages.NodeCollection.nodes', index=0,
      number=1, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  extension_ranges=[],
  serialized_start=65,
  serialized_end=112,
)

_NODECOLLECTION.fields_by_name['nodes'].message_type = _NODE
DESCRIPTOR.message_types_by_name['Node'] = _NODE
DESCRIPTOR.message_types_by_name['NodeCollection'] = _NODECOLLECTION

class Node(_message.Message):
  __metaclass__ = _reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _NODE

  # @@protoc_insertion_point(class_scope:messages.Node)

class NodeCollection(_message.Message):
  __metaclass__ = _reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _NODECOLLECTION

  # @@protoc_insertion_point(class_scope:messages.NodeCollection)


DESCRIPTOR.has_options = True
DESCRIPTOR._options = _descriptor._ParseOptions(descriptor_pb2.FileOptions(), '\n\031org.fursten.message.protoB\tNodeProto')
# @@protoc_insertion_point(module_scope)
